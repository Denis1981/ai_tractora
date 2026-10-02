'use client';

import { useMemo, useState } from 'react';
import styles from './finance.module.css';

type FundingScenarioId = 'internal' | 'pilot' | 'grant';
type RdStageId = 'analysis' | 'design' | 'prototype' | 'tests' | 'scale';
type SourceType = 'internal_budget' | 'industrial_partner' | 'grant_program' | 'loan';

type RdStage = {
    id: RdStageId;
    title: string;
    description: string;
    readiness: number;
    risk: 'low' | 'medium' | 'high';
    costPlanned: number;
    costActual: number;
};

type FundingSource = {
    id: string;
    label: string;
    type: SourceType;
    organization: string;
    instrument: string;
    amountCommitted: number;
    amountPotential: number;
    currency: 'RUB' | 'EUR' | 'USD';
};

type CashFlowItem = {
    id: string;
    period: string;
    scenario: FundingScenarioId;
    title: string;
    description: string;
    inflow: number;
    outflow: number;
};

type ScenarioConfig = {
    id: FundingScenarioId;
    label: string;
    caption: string;
    focus: string;
    totalBudget: number;
    totalCommitted: number;
    rdShare: number;
    pilotShare: number;
    scaleShare: number;
};

const rdStages: RdStage[] = [
    {
        id: 'analysis',
        title: 'Аналитика и обоснование',
        description:
            'Сбор исходных данных по нагруженности узлов, отказам, эффектам от модернизации и формирование концепции НИОКР.',
        readiness: 72,
        risk: 'medium',
        costPlanned: 6_800_000,
        costActual: 5_900_000
    },
    {
        id: 'design',
        title: 'Конструкторская проработка и КД',
        description:
            'Разработка конструкторской документации, цифровых моделей и интеграция требований по раме, навеске и гидросистеме.',
        readiness: 58,
        risk: 'medium',
        costPlanned: 9_500_000,
        costActual: 7_300_000
    },
    {
        id: 'prototype',
        title: 'Опытные образцы и доработка',
        description:
            'Изготовление опытных машин, доработка узлов по результатам первых испытаний, настройка контуров мониторинга.',
        readiness: 41,
        risk: 'high',
        costPlanned: 12_700_000,
        costActual: 4_200_000
    },
    {
        id: 'tests',
        title: 'Стендовые и полевые испытания',
        description:
            'Проверка прочности, ресурса, устойчивости навески, работы гидросистемы и электроники в реальных режимах.',
        readiness: 28,
        risk: 'high',
        costPlanned: 10_400_000,
        costActual: 2_900_000
    },
    {
        id: 'scale',
        title: 'Внедрение и масштабирование',
        description:
            'Тиражирование решения на линейку моделей, запуск пилота на промышленной площадке и подготовка к серийному производству.',
        readiness: 16,
        risk: 'medium',
        costPlanned: 8_600_000,
        costActual: 1_100_000
    }
];

const fundingSources: FundingSource[] = [
    {
        id: 'FS‑INT‑01',
        label: 'Внутренний бюджет КБ',
        type: 'internal_budget',
        organization: 'КБ тракторостроения',
        instrument: 'Проектный бюджет НИОКР по платформе',
        amountCommitted: 12_000_000,
        amountPotential: 15_000_000,
        currency: 'RUB'
    },
    {
        id: 'FS‑IND‑02',
        label: 'Индустриальный партнёр (пилот)',
        type: 'industrial_partner',
        organization: 'Промышленный завод‑партнёр',
        instrument: 'Софинансирование пилотного внедрения и опытной серии',
        amountCommitted: 8_500_000,
        amountPotential: 11_000_000,
        currency: 'RUB'
    },
    {
        id: 'FS‑GRANT‑03',
        label: 'Грантовая программа НИОКР',
        type: 'grant_program',
        organization: 'Фонд развития промышленности',
        instrument: 'Грант на НИОКР по энергосберегающим решениям в тракторостроении',
        amountCommitted: 6_000_000,
        amountPotential: 10_000_000,
        currency: 'RUB'
    },
    {
        id: 'FS‑LOAN‑04',
        label: 'Целевой кредит на модернизацию',
        type: 'loan',
        organization: 'Банк промышленного развития',
        instrument: 'Целевой кредит под модернизацию производственных мощностей',
        amountCommitted: 0,
        amountPotential: 14_000_000,
        currency: 'RUB'
    }
];

const cashFlowPlan: CashFlowItem[] = [
    {
        id: 'CF‑Q1‑INT',
        period: 'Q1 2027',
        scenario: 'internal',
        title: 'Старт аналитики и концепции НИОКР',
        description: 'Расходы на сбор данных, моделирование и проработку концепции модернизированной платформы.',
        inflow: 4_500_000,
        outflow: 3_800_000
    },
    {
        id: 'CF‑Q2‑INT',
        period: 'Q2 2027',
        scenario: 'internal',
        title: 'Разработка КД и цифровых моделей',
        description: 'Финансирование конструкторской документации и цифровых twins по ключевым узлам.',
        inflow: 5_000_000,
        outflow: 4_100_000
    },
    {
        id: 'CF‑Q3‑PILOT',
        period: 'Q3 2027',
        scenario: 'pilot',
        title: 'Опытная серия и запуск пилота',
        description: 'Софинансирование опытных машин, подготовка пилотной площадки и базовый мониторинг.',
        inflow: 8_500_000,
        outflow: 7_600_000
    },
    {
        id: 'CF‑Q4‑PILOT',
        period: 'Q4 2027',
        scenario: 'pilot',
        title: 'Полевые испытания и оценка эффекта',
        description: 'Полевые испытания на площадке партнёра, сбор данных по эффекту от модернизации.',
        inflow: 6_000_000,
        outflow: 5_300_000
    },
    {
        id: 'CF‑Y1‑GRANT',
        period: '2028',
        scenario: 'grant',
        title: 'Грантовый этап НИОКР',
        description: 'Грантовое финансирование ключевых этапов НИОКР: испытания, доработка, подготовка к тиражированию.',
        inflow: 10_000_000,
        outflow: 8_900_000
    }
];

const scenarios: ScenarioConfig[] = [
    {
        id: 'internal',
        label: 'Внутренний сценарий НИОКР',
        caption: 'Финансирование за счёт внутреннего бюджета КБ и проектных средств предприятия.',
        focus: 'Аналитика, концепция, КД и часть опытной серии.',
        totalBudget: 18_000_000,
        totalCommitted: 12_000_000,
        rdShare: 0.72,
        pilotShare: 0.18,
        scaleShare: 0.10
    },
    {
        id: 'pilot',
        label: 'Пилотный сценарий с индустриальным партнёром',
        caption: 'Софинансирование опытной серии и пилотного внедрения на промышленной площадке.',
        focus: 'Опытные образцы, пилотная площадка, мониторинг эффекта.',
        totalBudget: 19_500_000,
        totalCommitted: 8_500_000,
        rdShare: 0.42,
        pilotShare: 0.38,
        scaleShare: 0.20
    },
    {
        id: 'grant',
        label: 'Грантовый сценарий НИОКР',
        caption: 'Грантовое финансирование ключевых этапов НИОКР и масштабирования решения.',
        focus: 'Испытания, НИОКР, тиражирование и эффект для отрасли.',
        totalBudget: 24_000_000,
        totalCommitted: 6_000_000,
        rdShare: 0.36,
        pilotShare: 0.32,
        scaleShare: 0.32
    }
];

function getScenarioLabel(id: FundingScenarioId): string {
    return scenarios.find((s) => s.id === id)?.label ?? 'Сценарий';
}

function getScenarioClass(id: FundingScenarioId): string {
    if (id === 'internal') return 'scenarioInternal';
    if (id === 'pilot') return 'scenarioPilot';
    return 'scenarioGrant';
}

function formatCurrency(amount: number, currency: 'RUB' | 'EUR' | 'USD'): string {
    const formatted = amount.toLocaleString('ru-RU');
    const suffix = currency === 'RUB' ? '₽' : currency === 'EUR' ? '€' : '$';
    return `${formatted} ${suffix}`;
}

export default function FinancePage() {
    const [activeScenarioId, setActiveScenarioId] = useState<FundingScenarioId>('pilot');
    const [activeStageId, setActiveStageId] = useState<RdStageId>('prototype');
    const [selectedSourceId, setSelectedSourceId] = useState<string>('FS‑IND‑02');

    const activeScenario = useMemo(
        () => scenarios.find((s) => s.id === activeScenarioId) ?? scenarios[0],
        [activeScenarioId]
    );

    const activeStage = useMemo(
        () => rdStages.find((st) => st.id === activeStageId) ?? rdStages[0],
        [activeStageId]
    );

    const selectedSource = useMemo(
        () => fundingSources.find((fs) => fs.id === selectedSourceId) ?? fundingSources[0],
        [selectedSourceId]
    );

    const scenarioCashFlow = useMemo(
        () => cashFlowPlan.filter((cf) => cf.scenario === activeScenarioId),
        [activeScenarioId]
    );

    const rdTotalPlanned = useMemo(
        () => rdStages.reduce((sum, st) => sum + st.costPlanned, 0),
        []
    );

    const rdTotalActual = useMemo(
        () => rdStages.reduce((sum, st) => sum + st.costActual, 0),
        []
    );

    return (
        <div className={styles.page}>
            {/* HERO: контур НИОКР и финансирования */}
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <div className={styles.eyebrow}>
                        <span>TRACTORA AI · НИОКР и финансирование</span>
                    </div>
                    <h1 className={styles.title}>
                        Финансовый контур проекта НИОКР по тракторной платформе
                    </h1>
                    <p className={styles.description}>
                        На этом экране мы собираем сценарии финансирования, стадии НИОКР, источники средств и
                        денежные потоки по проекту модернизированной тракторной платформы. Платформа помогает
                        связать инженерные решения с бюджетом и грантовыми требованиями.
                    </p>

                    <div className={styles.heroMetaRow}>
                        <div className={styles.heroMetaChip}>
                            <span>Активный сценарий: {activeScenario.label}</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Фокус: {activeScenario.focus}</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Плановый бюджет: {activeScenario.totalBudget.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Уже подтверждено: {activeScenario.totalCommitted.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    </div>

                    <div className={styles.heroActions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => setActiveScenarioId('pilot')}
                        >
                            <span>Сценарий пилота с заводом‑партнёром</span>
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setActiveScenarioId('internal')}
                        >
                            <span>Внутренний сценарий НИОКР</span>
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setActiveScenarioId('grant')}
                        >
                            <span>Грантовый сценарий НИОКР</span>
                        </button>
                    </div>
                </div>

                <aside className={styles.heroAside}>
                    <header className={styles.heroAsideHeader}>
                        <span>Контур стадий НИОКР</span>
                        <span>Сводка бюджета и риска</span>
                    </header>

                    <div className={styles.stageTimeline}>
                        {rdStages.map((stage) => {
                            const isActive = stage.id === activeStageId;
                            const stageClass = styles[getScenarioClass(activeScenarioId)];
                            return (
                                <button
                                    key={stage.id}
                                    type="button"
                                    className={
                                        isActive
                                            ? `${styles.stageItem} ${styles.stageItemActive}`
                                            : styles.stageItem
                                    }
                                    onClick={() => setActiveStageId(stage.id)}
                                >
                                    <div className={styles.stageTitleRow}>
                                        <span className={styles.stageTitle}>{stage.title}</span>
                                        <span className={`${styles.stageBadge} ${stageClass}`}>
                      Стадия НИОКР
                    </span>
                                    </div>
                                    <p className={styles.stageDescription}>{stage.description}</p>
                                    <div className={styles.stageMetaRow}>
                                        <span>Готовность: {stage.readiness}%</span>
                                        <span>
                      План: {stage.costPlanned.toLocaleString('ru-RU')} ₽ · Факт:{' '}
                                            {stage.costActual.toLocaleString('ru-RU')} ₽
                    </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <footer className={styles.heroAsideFooter}>
            <span>
              Совокупный план по НИОКР: {rdTotalPlanned.toLocaleString('ru-RU')} ₽ · факт:{' '}
                {rdTotalActual.toLocaleString('ru-RU')} ₽
            </span>
                        <span>Данные демонстрационные, нужны для иллюстрации работы платформы.</span>
                    </footer>
                </aside>
            </section>

            {/* СЕКЦИЯ: сценарии и структура бюджета */}
            <section className={styles.scenarioRow}>
                <div className={styles.panelCard}>
                    <header className={styles.panelHeader}>
                        <div>
                            <div className={styles.panelEyebrow}>
                                <span>Структура финансирования</span>
                            </div>
                            <h2>Сценарии НИОКР, пилота и гранта</h2>
                            <p>
                                Выберите сценарий, чтобы увидеть распределение бюджета между стадиями НИОКР, пилотным
                                внедрением и масштабированием. Платформа показывает, сколько средств уже подтверждено и
                                какие этапы зависят от внешнего финансирования.
                            </p>
                        </div>
                    </header>

                    <div className={styles.scenarioGrid}>
                        {scenarios.map((scenario) => {
                            const isActive = scenario.id === activeScenarioId;
                            const scenarioClass = styles[getScenarioClass(scenario.id)];
                            const rdPercent = Math.round(scenario.rdShare * 100);
                            const pilotPercent = Math.round(scenario.pilotShare * 100);
                            const scalePercent = Math.round(scenario.scaleShare * 100);
                            return (
                                <button
                                    key={scenario.id}
                                    type="button"
                                    className={
                                        isActive
                                            ? `${styles.scenarioCard} ${styles.scenarioCardActive}`
                                            : styles.scenarioCard
                                    }
                                    onClick={() => setActiveScenarioId(scenario.id)}
                                >
                                    <div className={styles.scenarioHeader}>
                                        <span className={styles.scenarioLabel}>{scenario.label}</span>
                                        <span className={`${styles.scenarioTag} ${scenarioClass}`}>
                      Активный контур финансирования
                    </span>
                                    </div>
                                    <p className={styles.scenarioCaption}>{scenario.caption}</p>
                                    <div className={styles.scenarioMeta}>
                    <span>
                      Плановый бюджет: {scenario.totalBudget.toLocaleString('ru-RU')} ₽
                    </span>
                                        <span>
                      Уже подтверждено: {scenario.totalCommitted.toLocaleString('ru-RU')} ₽
                    </span>
                                    </div>
                                    <div className={styles.scenarioGauge}>
                                        <div className={styles.scenarioGaugeRow}>
                                            <span>НИОКР</span>
                                            <div className={styles.scenarioGaugeBar}>
                                                <div
                                                    className={`${styles.scenarioGaugeFill} ${styles.gaugeRd}`}
                                                    style={{ width: `${rdPercent}%` }}
                                                />
                                            </div>
                                            <span className={styles.scenarioGaugeValue}>{rdPercent}%</span>
                                        </div>
                                        <div className={styles.scenarioGaugeRow}>
                                            <span>Пилот</span>
                                            <div className={styles.scenarioGaugeBar}>
                                                <div
                                                    className={`${styles.scenarioGaugeFill} ${styles.gaugePilot}`}
                                                    style={{ width: `${pilotPercent}%` }}
                                                />
                                            </div>
                                            <span className={styles.scenarioGaugeValue}>{pilotPercent}%</span>
                                        </div>
                                        <div className={styles.scenarioGaugeRow}>
                                            <span>Масштабирование</span>
                                            <div className={styles.scenarioGaugeBar}>
                                                <div
                                                    className={`${styles.scenarioGaugeFill} ${styles.gaugeScale}`}
                                                    style={{ width: `${scalePercent}%` }}
                                                />
                                            </div>
                                            <span className={styles.scenarioGaugeValue}>{scalePercent}%</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ГЛАВНАЯ СЕТКА: источники + денежные потоки */}
            <section className={styles.mainGrid}>
                {/* Левая колонка: источники финансирования */}
                <div className={styles.leftColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Источники финансирования</span>
                                </div>
                                <h2>Внутренние средства, партнёры и гранты</h2>
                                <p>
                                    Здесь собраны ключевые источники финансирования проекта. Платформа показывает
                                    подтверждённые суммы, потенциал расширения и роль каждого источника в сценариях НИОКР,
                                    пилота и масштабирования.
                                </p>
                            </div>
                        </header>

                        <div className={styles.sourceList}>
                            {fundingSources.map((source) => {
                                const isSelected = source.id === selectedSourceId;
                                const scenarioClass =
                                    source.type === 'grant_program'
                                        ? styles.scenarioGrant
                                        : source.type === 'industrial_partner'
                                            ? styles.scenarioPilot
                                            : source.type === 'loan'
                                                ? styles.scenarioInternal
                                                : styles.scenarioInternal;

                                const cardClass = isSelected
                                    ? `${styles.sourceRow} ${styles.sourceRowActive}`
                                    : styles.sourceRow;

                                return (
                                    <button
                                        key={source.id}
                                        type="button"
                                        className={cardClass}
                                        onClick={() => setSelectedSourceId(source.id)}
                                    >
                                        <div className={styles.sourceMain}>
                                            <div className={styles.sourceTitleRow}>
                                                <span className={styles.sourceLabel}>{source.label}</span>
                                                <span className={`${styles.sourceTag} ${scenarioClass}`}>
                          {source.type === 'internal_budget'
                              ? 'Внутренний бюджет'
                              : source.type === 'industrial_partner'
                                  ? 'Индустриальный партнёр'
                                  : source.type === 'grant_program'
                                      ? 'Грантовая программа'
                                      : 'Целевой кредит'}
                        </span>
                                            </div>
                                            <p className={styles.sourceDescription}>
                                                {source.instrument}
                                            </p>
                                        </div>
                                        <div className={styles.sourceMeta}>
                                            <span className={styles.sourceOrg}>{source.organization}</span>
                                            <span>
                        Подтверждено:{' '}
                                                {formatCurrency(source.amountCommitted, source.currency)}
                      </span>
                                            <span>
                        Потенциал:{' '}
                                                {formatCurrency(source.amountPotential, source.currency)}
                      </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Правая колонка: денежные потоки и сигналы ИИ */}
                <div className={styles.rightColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Денежные потоки по сценарию</span>
                                </div>
                                <h2>План inflow/outflow по этапам НИОКР и пилота</h2>
                                <p>
                                    В этой таблице показаны денежные потоки по выбранному сценарию: поступление средств и
                                    расходы по кварталам и ключевым этапам. Платформа позволяет быстро увидеть баланс и
                                    зависимости от внешнего финансирования.
                                </p>
                            </div>
                        </header>

                        <div className={styles.cashTable}>
                            <div className={styles.cashHeaderRow}>
                                <span>Период</span>
                                <span>Сценарий</span>
                                <span>Описание</span>
                                <span>Inflow</span>
                                <span>Outflow</span>
                                <span>Баланс</span>
                            </div>
                            <div className={styles.cashBody}>
                                {scenarioCashFlow.map((cf) => {
                                    const balance = cf.inflow - cf.outflow;
                                    const balanceClass =
                                        balance >= 0 ? styles.balancePositive : styles.balanceNegative;
                                    const scenarioClass = styles[getScenarioClass(cf.scenario)];
                                    return (
                                        <div key={cf.id} className={styles.cashRow}>
                                            <span className={styles.cashPeriod}>{cf.period}</span>
                                            <span className={`${styles.cashScenario} ${scenarioClass}`}>
                        {getScenarioLabel(cf.scenario)}
                      </span>
                                            <span className={styles.cashTitle}>{cf.title}</span>
                                            <span className={styles.cashValue}>
                        {cf.inflow.toLocaleString('ru-RU')} ₽
                      </span>
                                            <span className={styles.cashValue}>
                        {cf.outflow.toLocaleString('ru-RU')} ₽
                      </span>
                                            <span className={`${styles.cashBalance} ${balanceClass}`}>
                        {balance.toLocaleString('ru-RU')} ₽
                      </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={styles.inspectorGrid}>
                            <div className={styles.inspectorItem}>
                                <span>Активная стадия НИОКР</span>
                                <strong>{activeStage.title}</strong>
                            </div>
                            <div className={styles.inspectorItem}>
                                <span>Готовность и риск по стадии</span>
                                <strong>
                                    Готовность {activeStage.readiness}% · Риск{' '}
                                    {activeStage.risk === 'low'
                                        ? 'Низкий'
                                        : activeStage.risk === 'medium'
                                            ? 'Средний'
                                            : 'Высокий'}
                                </strong>
                            </div>
                            <div className={styles.inspectorItem}>
                                <span>Подтверждённые средства по источнику</span>
                                <strong>
                                    {selectedSource.label}: {formatCurrency(selectedSource.amountCommitted, selectedSource.currency)}
                                </strong>
                            </div>
                            <div className={styles.inspectorItem}>
                                <span>Потенциал расширения финансирования</span>
                                <strong>
                                    До {formatCurrency(selectedSource.amountPotential, selectedSource.currency)}
                                </strong>
                            </div>
                        </div>

                        <div className={styles.inspectorSignals}>
                            <div className={styles.signalItem}>
                <span>
                  Платформа фиксирует, что стадия «{activeStage.title}» в сценарии
                  «{activeScenario.label}» критична по риску и должна иметь отдельное обоснование в
                  пакете финансирования.
                </span>
                            </div>
                            <div className={styles.signalItem}>
                <span>
                  ИИ‑инспектор предлагает связать выбранный источник «{selectedSource.label}» со
                  стадиями «Опытные образцы» и «Полевые испытания», чтобы индустриальный заказчик видел
                  вклад финансирования в эффект НИОКР.
                </span>
                            </div>
                            <div className={styles.signalItem}>
                <span>
                  Для грантового сценария платформа подсвечивает необходимость описания отраслевого
                  эффекта и планов тиражирования в заявке, исходя из распределения бюджета по стадиям.
                </span>
                            </div>
                        </div>

                        <div className={styles.nextActionList}>
                            <div className={styles.nextActionItem}>
                <span>
                  Обновить финансовый паспорт проекта НИОКР: привязать стадии, источники и денежные
                  потоки к единому досье для промышленного партнёра.
                </span>
                            </div>
                            <div className={styles.nextActionItem}>
                <span>
                  Сформировать пакет для заявки на грант: структура бюджета по стадиям, подтверждённые
                  средства, ожидаемый эффект и план масштабирования.
                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={styles.nextActionButton}
                            onClick={() => {
                                setActiveScenarioId(
                                    activeScenarioId === 'pilot'
                                        ? 'grant'
                                        : activeScenarioId === 'grant'
                                            ? 'internal'
                                            : 'pilot'
                                );
                            }}
                        >
                            Переключить сценарий НИОКР/финансирования (демо‑режим)
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}