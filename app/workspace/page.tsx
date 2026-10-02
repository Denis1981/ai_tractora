'use client';

import { useMemo, useState } from 'react';
import styles from './workspace.module.css';

type StageId = 'concept' | 'design' | 'cd_check' | 'rd_finance';

type RequirementKind = 'functional' | 'constraint' | 'risk';
type RequirementStatus = 'open' | 'in_review' | 'approved';

type Requirement = {
    id: string;
    title: string;
    description: string;
    kind: RequirementKind;
    status: RequirementStatus;
    nodeId: string;
    risk: 'low' | 'medium' | 'high';
};

type NodeId = 'frame' | 'transmission' | 'hydraulics' | 'electronics';

type Node = {
    id: NodeId;
    label: string;
    role: string;
    stageImpact: string;
};

type CheckSeverity = 'ok' | 'warn' | 'error';

type CheckItem = {
    id: string;
    title: string;
    description: string;
    severity: CheckSeverity;
};

type RndStageId = 'analysis' | 'prototype' | 'tests' | 'implementation';

type RndStage = {
    id: RndStageId;
    title: string;
    description: string;
    readiness: number; // 0-100
    risk: 'low' | 'medium' | 'high';
};

type FinanceItem = {
    id: string;
    title: string;
    description: string;
    period: string;
    amount: number;
    fundingSource: string;
};

const stages: { id: StageId; label: string; caption: string }[] = [
    {
        id: 'concept',
        label: 'Концепция изделия',
        caption: 'Формирование паспорта тракторной платформы и ключевых узлов.'
    },
    {
        id: 'design',
        label: 'Конструкторская проработка',
        caption: 'Узлы, требования, конфликты и влияние на НИОКР.'
    },
    {
        id: 'cd_check',
        label: 'Проверка КД',
        caption: 'Автоматическая проверка пакета конструкторской документации.'
    },
    {
        id: 'rd_finance',
        label: 'Финансирование НИОКР',
        caption: 'Сборка цифрового пакета для пилота и гранта.'
    }
];

const nodes: Node[] = [
    {
        id: 'frame',
        label: 'Рама и силовая структура',
        role: 'Несущая система, распределение нагрузок, интеграция навесного оборудования.',
        stageImpact: 'Влияет на компоновку трансмиссии, гидравлики и точек крепления.'
    },
    {
        id: 'transmission',
        label: 'Трансмиссия',
        role: 'Передача крутящего момента, режимы работы, ресурс агрегатов.',
        stageImpact: 'Определяет требования к нагрузкам, вибрациям и режимам эксплуатации.'
    },
    {
        id: 'hydraulics',
        label: 'Гидросистема и навеска',
        role: 'Работа навесных орудий, давление, расход, устойчивость контура.',
        stageImpact: 'Критична для НИОКР по навесному оборудованию и энергосбережению.'
    },
    {
        id: 'electronics',
        label: 'Электрика и управление',
        role: 'Системы управления, сенсоры, CAN‑шина, связь с внешними модулями.',
        stageImpact: 'Влияет на автоматизацию, встроенный мониторинг и AI‑модули.'
    }
];

const requirements: Requirement[] = [
    {
        id: 'REQ‑F‑101',
        title: 'Прочность рамы под навеску 3‑й категории',
        description:
            'Рама тракторной платформы должна выдерживать навесное оборудование 3‑й категории по ГОСТ без остаточных деформаций в течение всего гарантийного ресурса.',
        kind: 'functional',
        status: 'in_review',
        nodeId: 'frame',
        risk: 'medium'
    },
    {
        id: 'REQ‑C‑204',
        title: 'Ограничение массы навесного оборудования',
        description:
            'Суммарная масса навесного оборудования на задней навеске не должна превышать 2100 кг при сохранении устойчивости трактора на уклоне до 12°.',
        kind: 'constraint',
        status: 'open',
        nodeId: 'hydraulics',
        risk: 'high'
    },
    {
        id: 'REQ‑F‑315',
        title: 'Стабильность гидросистемы при низких температурах',
        description:
            'Гидросистема должна обеспечивать устойчивую работу навески при температуре до −30 °C без кавитации и отказов предохранительных клапанов.',
        kind: 'functional',
        status: 'approved',
        nodeId: 'hydraulics',
        risk: 'low'
    },
    {
        id: 'REQ‑R‑412',
        title: 'Риск перегрузки переднего моста',
        description:
            'При установке фронтального погрузчика и тяжёлого навесного оборудования рассчитывается риск превышения допустимой нагрузки на передний мост.',
        kind: 'risk',
        status: 'in_review',
        nodeId: 'frame',
        risk: 'medium'
    },
    {
        id: 'REQ‑C‑521',
        title: 'Согласованность электрических нагрузок',
        description:
            'Суммарная мощность потребителей электроэнергии не должна приводить к выходу напряжения за пределы допуска в бортовой сети.',
        kind: 'constraint',
        status: 'open',
        nodeId: 'electronics',
        risk: 'medium'
    }
];

const cdChecks: CheckItem[] = [
    {
        id: 'CHK‑01',
        title: 'Комплектность пакета КД',
        description:
            'Выявлено 2 отсутствующих спецификации по навесному оборудованию и одна несогласованная ведомость изменений.',
        severity: 'warn'
    },
    {
        id: 'CHK‑02',
        title: 'Конфликты требований',
        description:
            'Найдены противоречия между ограничением массы навески и текущей компоновкой гидросистемы на задней навеске.',
        severity: 'error'
    },
    {
        id: 'CHK‑03',
        title: 'Согласование электрических нагрузок',
        description:
            'Параметры новых датчиков и блока управления вписываются в допустимый диапазон нагрузки на генератор.',
        severity: 'ok'
    }
];

const rndStages: RndStage[] = [
    {
        id: 'analysis',
        title: 'Аналитика и обоснование',
        description:
            'Сбор исходных данных по нагруженности узлов, режимам работы, отказам и эффекты от модернизации.',
        readiness: 65,
        risk: 'medium'
    },
    {
        id: 'prototype',
        title: 'Прототипирование и КД',
        description:
            'Разработка набора конструкторской документации под опытную серию и подготовка цифрового прототипа.',
        readiness: 40,
        risk: 'medium'
    },
    {
        id: 'tests',
        title: 'Стендовые и полевые испытания',
        description:
            'Проверка прочности, ресурса, устойчивости гидросистемы и эксплуатационных режимов навески.',
        readiness: 25,
        risk: 'high'
    },
    {
        id: 'implementation',
        title: 'Внедрение и масштабирование',
        description:
            'Тиражирование решения на линейку моделей и развёртывание цифрового мониторинга в эксплуатации.',
        readiness: 10,
        risk: 'medium'
    }
];

const financePlan: FinanceItem[] = [
    {
        id: 'FIN‑Q1',
        title: 'Аналитика и цифровой прототип',
        description: 'Работы по сбору данных, моделированию и первичному цифровому Twin для рамы и навески.',
        period: 'Q1–Q2',
        amount: 7_500_000,
        fundingSource: 'Проектный бюджет КБ'
    },
    {
        id: 'FIN‑Q2',
        title: 'Опытная серия и испытания',
        description: 'Изготовление опытных образцов, стендовые и полевые испытания.',
        period: 'Q3–Q4',
        amount: 12_000_000,
        fundingSource: 'НИОКР + грант'
    },
    {
        id: 'FIN‑Q3',
        title: 'Подготовка к внедрению',
        description: 'Адаптация документации под серийное производство и подготовка пилота на промышленной площадке.',
        period: 'Q1 следующего года',
        amount: 5_800_000,
        fundingSource: 'Пилот с промышленным партнёром'
    }
];

export default function WorkspacePage() {
    const [activeStage, setActiveStage] = useState<StageId>('design');
    const [activeNodeId, setActiveNodeId] = useState<NodeId>('hydraulics');
    const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>('REQ‑C‑204');
    const [selectedRndStageId, setSelectedRndStageId] = useState<RndStageId>('prototype');

    const activeNode = useMemo(
        () => nodes.find((n) => n.id === activeNodeId) ?? nodes[0],
        [activeNodeId]
    );

    const filteredRequirements = useMemo(
        () => requirements.filter((r) => r.nodeId === activeNodeId),
        [activeNodeId]
    );

    const selectedRequirement = useMemo(
        () => filteredRequirements.find((r) => r.id === selectedRequirementId) ?? filteredRequirements[0] ?? null,
        [filteredRequirements, selectedRequirementId]
    );

    const selectedRndStage = useMemo(
        () => rndStages.find((s) => s.id === selectedRndStageId) ?? rndStages[0],
        [selectedRndStageId]
    );

    const stageLabel = stages.find((s) => s.id === activeStage)?.label ?? stages[1].label;
    const stageCaption = stages.find((s) => s.id === activeStage)?.caption ?? stages[1].caption;

    return (
        <div className={styles.page}>
            {/* фоновые орбы и сетка */}
            <div className={styles.orbBlue} />
            <div className={styles.orbViolet} />
            <div className={styles.gridOverlay} />

            {/* Hero: статус проекта */}
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <div className={styles.eyebrow}>
                        <span>TRACTORA AI · Платформа для КБ и НИОКР</span>
                    </div>
                    <h1 className={styles.title}>
                        ИИ‑пространство принятия конструкторских решений по тракторной платформе
                    </h1>
                    <p className={styles.description}>
                        Здесь КБ видит узлы, требования, риски и влияние на НИОКР. Платформа помогает подобрать
                        конфигурацию рамы, навески, гидросистемы и электроники с учётом нагрузок, ограничений и
                        финансирования проекта.
                    </p>

                    <div className={styles.heroMetaRow}>
                        <div className={styles.heroMetaChip}>
                            <span>Изделие: тракторная платформа 180–220 л.с.</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Активный узел: {activeNode.label}</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Стадия НИОКР: {selectedRndStage.title}</span>
                        </div>
                    </div>

                    <div className={styles.heroActions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => setActiveStage('cd_check')}
                        >
                            <span>Запустить проверку пакета КД</span>
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setActiveStage('rd_finance')}
                        >
                            <span>Сформировать пакет НИОКР для пилота/гранта</span>
                        </button>
                    </div>
                </div>

                <aside className={styles.heroAside}>
                    <header className={styles.heroAsideHeader}>
                        <span>Контур этапов</span>
                        <span>Статус: демо‑проект</span>
                    </header>

                    <div className={styles.timeline}>
                        {stages.map((stage, index) => {
                            const isActive = stage.id === activeStage;
                            const isLast = index === stages.length - 1;
                            return (
                                <button
                                    key={stage.id}
                                    type="button"
                                    className={
                                        isActive
                                            ? `${styles.timelineItem} ${styles.timelineItemActive}`
                                            : styles.timelineItem
                                    }
                                    onClick={() => setActiveStage(stage.id)}
                                >
                                    <div className={styles.timelineMarkerWrap}>
                                        <div className={styles.timelineMarker} />
                                        {!isLast && <div className={styles.timelineLine} />}
                                    </div>
                                    <div className={styles.timelineText}>
                                        <strong>{stage.label}</strong>
                                        <span>{stage.caption}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <footer className={styles.heroAsideFooter}>
                        <span>Активный режим: {stageLabel}</span>
                        <span>Платформа работает в режиме демонстрации для акселератора Agrotech</span>
                    </footer>
                </aside>
            </section>

            {/* Tabs: сценарии работы */}
            <section className={styles.stepTabs}>
                {stages.map((stage) => (
                    <button
                        key={`tab-${stage.id}`}
                        type="button"
                        className={
                            activeStage === stage.id
                                ? `${styles.stepTab} ${styles.stepTabActive}`
                                : styles.stepTab
                        }
                        onClick={() => setActiveStage(stage.id)}
                    >
                        <div className={styles.stepTabText}>
                            <span>{stage.label}</span>
                            <small>{stage.caption}</small>
                        </div>
                    </button>
                ))}
            </section>

            {/* Основное рабочее пространство */}
            <section className={styles.workspaceGrid}>
                {/* Левая колонка: узлы и требования */}
                <div className={styles.leftColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Структура изделия</span>
                                </div>
                                <h2>Узлы тракторной платформы</h2>
                                <p>
                                    Выберите ключевой узел, чтобы увидеть связанные требования, риски и влияние на НИОКР.
                                    Платформа подсвечивает конфликтные зоны и помогает готовить решения для КБ.
                                </p>
                            </div>
                        </header>

                        <div className={styles.nodeGrid}>
                            {nodes.map((node) => {
                                const isActiveNode = node.id === activeNodeId;
                                return (
                                    <button
                                        key={node.id}
                                        type="button"
                                        className={
                                            isActiveNode
                                                ? `${styles.nodeCard} ${styles.nodeCardActive}`
                                                : styles.nodeCard
                                        }
                                        onClick={() => {
                                            setActiveNodeId(node.id);
                                            const firstReq = requirements.find((r) => r.nodeId === node.id);
                                            setSelectedRequirementId(firstReq?.id ?? null);
                                        }}
                                    >
                                        <div className={styles.nodeHeader}>
                                            <span className={styles.nodeId}>{node.id.toUpperCase()}</span>
                                        </div>
                                        <div className={styles.nodeTitle}>{node.label}</div>
                                        <div className={styles.nodeRole}>{node.role}</div>
                                        <div className={styles.nodeRole}>{node.stageImpact}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Требования и риски</span>
                                </div>
                                <h2>Требования по выбранному узлу</h2>
                                <p>
                                    Список требований и ограничений, влияющих на конструкторские решения по текущему узлу.
                                    ИИ‑платформа помогает быстро выявить противоречия и области повышенного риска.
                                </p>
                            </div>
                        </header>

                        <div className={styles.listSection}>
                            {filteredRequirements.map((req) => {
                                const isActive = req.id === selectedRequirementId;
                                const rowClass = isActive
                                    ? `${styles.listRow} ${styles.listRowActive}`
                                    : styles.listRow;

                                let kindClass = styles.badge;
                                if (req.kind === 'functional') kindClass = `${styles.badge} ${styles.reqFunctional}`;
                                if (req.kind === 'constraint') kindClass = `${styles.badge} ${styles.reqConstraint}`;
                                if (req.kind === 'risk') kindClass = `${styles.badge} ${styles.reqRisk}`;

                                let statusClass = styles.badge;
                                if (req.status === 'open') statusClass = `${styles.badge} ${styles.reqOpen}`;
                                if (req.status === 'in_review')
                                    statusClass = `${styles.badge} ${styles.reqInReview}`;
                                if (req.status === 'approved')
                                    statusClass = `${styles.badge} ${styles.reqApproved}`;

                                let riskClass = styles.badge;
                                if (req.risk === 'low') riskClass = `${styles.badge} ${styles.riskLow}`;
                                if (req.risk === 'medium') riskClass = `${styles.badge} ${styles.riskMedium}`;
                                if (req.risk === 'high') riskClass = `${styles.badge} ${styles.riskHigh}`;

                                return (
                                    <button
                                        key={req.id}
                                        type="button"
                                        className={rowClass}
                                        onClick={() => setSelectedRequirementId(req.id)}
                                    >
                                        <div className={styles.listRowMain}>
                                            <strong>{req.id} · {req.title}</strong>
                                            <span>{req.description}</span>
                                        </div>
                                        <div className={styles.listRowMeta}>
                      <span className={kindClass}>
                        Тип: {req.kind === 'functional'
                          ? 'Функциональное'
                          : req.kind === 'constraint'
                              ? 'Ограничение'
                              : 'Риск'}
                      </span>
                                            <span className={statusClass}>
                        Статус: {req.status === 'open'
                                                ? 'Открыто'
                                                : req.status === 'in_review'
                                                    ? 'На согласовании'
                                                    : 'Утверждено'}
                      </span>
                                            <span className={riskClass}>
                        Уровень риска: {req.risk === 'low'
                                                ? 'Низкий'
                                                : req.risk === 'medium'
                                                    ? 'Средний'
                                                    : 'Высокий'}
                      </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Правая колонка: инспектор решений и НИОКР */}
                <div className={styles.rightColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>ИИ‑инспектор КД</span>
                                </div>
                                <h2>Результаты проверки конструкторской документации</h2>
                                <p>
                                    Платформа анализирует комплектность, согласованность требований и влияние изменения узлов
                                    на сроки и бюджет НИОКР. Ниже — ключевые сигналы по текущему контексту.
                                </p>
                            </div>
                        </header>

                        <div className={styles.rndList}>
                            {cdChecks.map((chk) => {
                                let badgeClass = styles.badge;
                                if (chk.severity === 'ok') badgeClass = `${styles.badge} ${styles.checkOk}`;
                                if (chk.severity === 'warn') badgeClass = `${styles.badge} ${styles.checkWarn}`;
                                if (chk.severity === 'error') badgeClass = `${styles.badge} ${styles.checkError}`;
                                return (
                                    <div key={chk.id} className={styles.rndRow}>
                                        <div className={styles.rndMain}>
                                            <strong>{chk.title}</strong>
                                            <span>{chk.description}</span>
                                        </div>
                                        <div className={styles.rndMeta}>
                                            <span>{selectedRequirement ? selectedRequirement.id : 'Требование не выбрано'}</span>
                                            <span>Узел: {activeNode.label}</span>
                                        </div>
                                        <div className={styles.rndGaugeWrap}>
                                            <div className={styles.gaugeItem}>
                                                <svg className={styles.gaugeSvg} viewBox="0 0 100 100">
                                                    <circle
                                                        className={styles.gaugeTrack}
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                    />
                                                    <circle
                                                        className={styles.gaugeFill}
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        strokeDasharray="251.2"
                                                        strokeDashoffset={
                                                            chk.severity === 'ok'
                                                                ? 251.2 - (0.8 * 251.2)
                                                                : chk.severity === 'warn'
                                                                    ? 251.2 - (0.55 * 251.2)
                                                                    : 251.2 - (0.25 * 251.2)
                                                        }
                                                    />
                                                </svg>
                                                <div className={styles.gaugeLabel}>
                                                    <span>Уровень риска</span>
                                                    <strong>
                                                        {chk.severity === 'ok'
                                                            ? 'Низкий'
                                                            : chk.severity === 'warn'
                                                                ? 'Средний'
                                                                : 'Высокий'}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Контур НИОКР и финансирования</span>
                                </div>
                                <h2>Дорожная карта проекта НИОКР</h2>
                                <p>
                                    Платформа собирает цифровой план НИОКР по узлам и стадиям, оценивает готовность и риски
                                    и формирует пакет для пилота и подачи на грант.
                                </p>
                            </div>
                        </header>

                        <div className={styles.financeList}>
                            {financePlan.map((item) => (
                                <div key={item.id} className={styles.financeRow}>
                                    <div className={styles.financeMain}>
                                        <strong>{item.title}</strong>
                                        <span>{item.description}</span>
                                    </div>
                                    <div className={styles.financeMeta}>
                                        <span>Период: {item.period}</span>
                                        <span>Источник: {item.fundingSource}</span>
                                    </div>
                                    <div className={styles.financeValue}>
                                        {item.amount.toLocaleString('ru-RU')} ₽
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.inspectorGrid}>
                            <div className={styles.inspectorItem}>
                                <span>Активная стадия НИОКР</span>
                                <strong>{selectedRndStage.title}</strong>
                            </div>
                            <div className={styles.inspectorItem}>
                                <span>Готовность по оценке платформы</span>
                                <strong>{selectedRndStage.readiness}%</strong>
                            </div>
                        </div>

                        <div className={styles.inspectorSignals}>
                            <div className={styles.signalItem}>
                <span>
                  Платформа фиксирует, что текущие изменения по узлу “{activeNode.label}” критичны для
                  стадии “{selectedRndStage.title}” и требуют отдельного обоснования в пакете НИОКР.
                </span>
                            </div>
                            <div className={styles.signalItem}>
                <span>
                  ИИ‑инспектор предлагает подготовить отдельный раздел по рискам перегрузки навески и
                  влиянию на долговечность рамы, чтобы индустриальный заказчик видел последствия решений.
                </span>
                            </div>
                        </div>

                        <div className={styles.nextActionList}>
                            <div className={styles.nextActionItem}>
                <span>
                  Обновить паспорт проекта НИОКР с учётом выбранных узлов и требований и отправить на
                  согласование с промышленным заказчиком.
                </span>
                            </div>
                            <div className={styles.nextActionItem}>
                <span>
                  Сформировать пакет для пилотного внедрения на заводе: дорожная карта, бюджет, ожидания
                  по эффекту и список цифровых артефактов (КД, модели, отчёты).
                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={styles.nextActionButton}
                            onClick={() => {
                                setSelectedRndStageId(
                                    selectedRndStageId === 'prototype' ? 'analysis' : 'prototype'
                                );
                            }}
                        >
                            Переключить стадию НИОКР (демо‑режим)
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}