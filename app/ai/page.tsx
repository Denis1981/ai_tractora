'use client';

import { useMemo, useState } from 'react';
import styles from './ai.module.css';

type AiDomainId = 'engineering' | 'docs' | 'finance';
type ConfidenceLevel = 'low' | 'medium' | 'high';
type ImpactLevel = 'local' | 'cross_module' | 'strategic';

type AiCheck = {
    id: string;
    domain: AiDomainId;
    title: string;
    summary: string;
    context: string;
    confidence: ConfidenceLevel;
    impact: ImpactLevel;
    relatedNode?: string;
    relatedDocCode?: string;
    relatedScenario?: string;
};

type AiRecommendation = {
    id: string;
    title: string;
    description: string;
    domain: AiDomainId;
    priority: 'now' | 'soon' | 'later';
    owner: string;
};

const aiChecks: AiCheck[] = [
    {
        id: 'AI‑ENG‑FRAME‑01',
        domain: 'engineering',
        title: 'Конфликт массы навески и ресурса рамы',
        summary:
            'ИИ выявил конфликт между ограничением массы навесного оборудования и текущей компоновкой силовой структуры рамы.',
        context:
            'По данным workspace, требование REQ‑C‑204 по массе навески и расчётная нагрузка на раму пересекаются с повышенным риском перегрузки переднего моста.',
        confidence: 'high',
        impact: 'cross_module',
        relatedNode: 'Рама и силовая структура',
        relatedScenario: 'Пилотный сценарий с индустриальным партнёром'
    },
    {
        id: 'AI‑DOC‑GRANT‑02',
        domain: 'docs',
        title: 'Недостаточная проработка блока по эффекту НИОКР в грантовом пакете',
        summary:
            'В грантовом пакете документации отсутствует развернутый блок по ожидаемому отраслевому эффекту от модернизации платформы.',
        context:
            'По данным documentation, пакет «Пакет для заявки на грант/НИОКР» содержит базовые отчёты, но не раскрывает эффект по снижению затрат и повышению ресурса навесного оборудования.',
        confidence: 'medium',
        impact: 'strategic',
        relatedDocCode: 'RND‑FRAME‑009',
        relatedScenario: 'Грантовый сценарий НИОКР'
    },
    {
        id: 'AI‑FIN‑FLOW‑03',
        domain: 'finance',
        title: 'Высокая зависимость пилотного сценария от внешнего финансирования',
        summary:
            'Пилотный сценарий имеет высокий баланс inflow/outflow и заметную зависимость от средств индустриального партнёра.',
        context:
            'По данным finance, стадии «Опытная серия» и «Полевые испытания» покрываются преимущественно за счёт источника FS‑IND‑02, в случае задержки финансирования возникают риски по срокам.',
        confidence: 'high',
        impact: 'strategic',
        relatedScenario: 'Пилотный сценарий с индустриальным партнёром'
    },
    {
        id: 'AI‑ENG‑ELECTR‑04',
        domain: 'engineering',
        title: 'Потенциал для снижения нагрузки на электронику за счёт оптимизации датчиков',
        summary:
            'ИИ отметил возможность оптимизации состава датчиков и контроллеров для снижения нагрузки на бортовую сеть.',
        context:
            'Требование REQ‑C‑521 по согласованности электрических нагрузок показывает запас по мощности генератора, который можно использовать для встроенного мониторинга без риска выхода за допуск.',
        confidence: 'medium',
        impact: 'local',
        relatedNode: 'Электрика и управление'
    },
    {
        id: 'AI‑DOC‑KD‑05',
        domain: 'docs',
        title: 'Разрыв между КД и отчётами испытаний по навеске',
        summary:
            'В документации есть разрыв в связности между конструкторской документацией на навеску и отчётами стендовых испытаний.',
        context:
            'Спецификация SP‑TR‑001 и отчёт TR‑TEST‑021 рассматривают разные режимы работы навески, ИИ предлагает уточнить единый профиль эксплуатации.',
        confidence: 'low',
        impact: 'cross_module',
        relatedDocCode: 'TR‑TEST‑021'
    }
];

const aiRecommendations: AiRecommendation[] = [
    {
        id: 'REC‑ENG‑FRAME‑01',
        title: 'Подготовить расчётный блок по перегрузке рамы для пилотного досье',
        description:
            'Сформировать отдельный раздел в пилотном досье с расчётами по нагрузке на раму и передний мост при использовании тяжёлой навески и фронтального погрузчика.',
        domain: 'engineering',
        priority: 'now',
        owner: 'КБ тракторостроения'
    },
    {
        id: 'REC‑DOC‑GRANT‑02',
        title: 'Расширить блок по эффекту НИОКР в грантовом пакете',
        description:
            'Добавить в грантовый пакет раздел по ожидаемому отраслевому эффекту: снижение простоев, экономия топлива, повышение ресурса навески и рамных узлов.',
        domain: 'docs',
        priority: 'soon',
        owner: 'НИОКР по конструкции'
    },
    {
        id: 'REC‑FIN‑FLOW‑03',
        title: 'Перераспределить внутренние средства на критичные стадии пилота',
        description:
            'Часть внутреннего бюджета КБ направить на покрытие рисков по стадиям «Опытная серия» и «Полевые испытания», чтобы снизить зависимость от внешнего финансирования.',
        domain: 'finance',
        priority: 'now',
        owner: 'Проектный офис НИОКР'
    },
    {
        id: 'REC‑ENG‑ELECTR‑04',
        title: 'Оптимизировать состав датчиков в узле электроники',
        description:
            'Провести инвентаризацию датчиков и блоков управления, исключить дублирующие каналы и подготовить решение по встроенному мониторингу без увеличения пиковой нагрузки.',
        domain: 'engineering',
        priority: 'later',
        owner: 'Отдел электроники'
    }
];

function getDomainLabel(domain: AiDomainId): string {
    if (domain === 'engineering') return 'Конструкторский контур';
    if (domain === 'docs') return 'Документация и КД';
    return 'НИОКР и финансирование';
}

function getConfidenceLabel(level: ConfidenceLevel): string {
    if (level === 'low') return 'Уверенность: низкая';
    if (level === 'medium') return 'Уверенность: средняя';
    return 'Уверенность: высокая';
}

function getImpactLabel(level: ImpactLevel): string {
    if (level === 'local') return 'Влияние: локальное';
    if (level === 'cross_module') return 'Влияние: межмодульное';
    return 'Влияние: стратегическое';
}

function getConfidenceClass(level: ConfidenceLevel): string {
    if (level === 'low') return 'confidenceLow';
    if (level === 'medium') return 'confidenceMedium';
    return 'confidenceHigh';
}

function getImpactClass(level: ImpactLevel): string {
    if (level === 'local') return 'impactLocal';
    if (level === 'cross_module') return 'impactCross';
    return 'impactStrategic';
}

function getPriorityLabel(priority: AiRecommendation['priority']): string {
    if (priority === 'now') return 'Сделать сейчас';
    if (priority === 'soon') return 'Сделать в ближайшее время';
    return 'Внести в план';
}

function getPriorityClass(priority: AiRecommendation['priority']): string {
    if (priority === 'now') return 'priorityNow';
    if (priority === 'soon') return 'prioritySoon';
    return 'priorityLater';
}

export default function AiPage() {
    const [activeDomainId, setActiveDomainId] = useState<AiDomainId>('engineering');
    const [selectedCheckId, setSelectedCheckId] = useState<string>('AI‑ENG‑FRAME‑01');

    const domainChecks = useMemo(
        () => aiChecks.filter((check) => check.domain === activeDomainId),
        [activeDomainId]
    );

    const selectedCheck = useMemo(
        () =>
            aiChecks.find((check) => check.id === selectedCheckId) ??
            domainChecks[0] ??
            aiChecks[0],
        [selectedCheckId, domainChecks]
    );

    const domainRecommendations = useMemo(
        () => aiRecommendations.filter((rec) => rec.domain === activeDomainId),
        [activeDomainId]
    );

    return (
        <div className={styles.page}>
            {/* HERO: AI‑уровень платформы */}
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <div className={styles.eyebrow}>
                        <span>TRACTORA AI · AI‑проверки и рекомендации</span>
                    </div>
                    <h1 className={styles.title}>
                        AI‑слой проверки решений по тракторной платформе
                    </h1>
                    <p className={styles.description}>
                        На этом экране собраны AI‑проверки по конструкторскому контуру, документации и
                        финансированию. Платформа показывает, где есть конфликты требований, пробелы в пакетах
                        документов и риски по денежным потокам НИОКР, а также предлагает конкретные действия для
                        команды.
                    </p>

                    <div className={styles.heroMetaRow}>
                        <div className={styles.heroMetaChip}>
                            <span>Активный контур: {getDomainLabel(activeDomainId)}</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
              <span>
                Всего AI‑проверок: {aiChecks.filter((c) => c.domain === activeDomainId).length}
              </span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Рекомендаций по контурy: {domainRecommendations.length}</span>
                        </div>
                    </div>

                    <div className={styles.heroActions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => setActiveDomainId('engineering')}
                        >
                            <span>AI‑проверки конструкторских решений</span>
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setActiveDomainId('docs')}
                        >
                            <span>AI‑инспектор документации и КД</span>
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setActiveDomainId('finance')}
                        >
                            <span>AI‑инспектор НИОКР и финансирования</span>
                        </button>
                    </div>
                </div>

                <aside className={styles.heroAside}>
                    <header className={styles.heroAsideHeader}>
                        <span>Обзор AI‑контуров</span>
                        <span>Статус: демо‑данные</span>
                    </header>

                    <div className={styles.domainList}>
                        {(['engineering', 'docs', 'finance'] as AiDomainId[]).map((domain) => {
                            const isActive = domain === activeDomainId;
                            const countChecks = aiChecks.filter((c) => c.domain === domain).length;
                            const countRecs = aiRecommendations.filter((r) => r.domain === domain).length;
                            return (
                                <button
                                    key={domain}
                                    type="button"
                                    className={
                                        isActive
                                            ? `${styles.domainItem} ${styles.domainItemActive}`
                                            : styles.domainItem
                                    }
                                    onClick={() => {
                                        setActiveDomainId(domain);
                                        const firstCheck = aiChecks.find((c) => c.domain === domain);
                                        setSelectedCheckId(firstCheck?.id ?? selectedCheckId);
                                    }}
                                >
                                    <div className={styles.domainHeader}>
                                        <span className={styles.domainLabel}>{getDomainLabel(domain)}</span>
                                    </div>
                                    <div className={styles.domainMeta}>
                                        <span>AI‑проверок: {countChecks}</span>
                                        <span>Рекомендаций: {countRecs}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <footer className={styles.heroAsideFooter}>
                        <span>Платформа работает на демонстрационных примерах для акселератора.</span>
                        <span>В боевом режиме проверяются реальные КД, документы и данные по НИОКР.</span>
                    </footer>
                </aside>
            </section>

            {/* Основная сетка: проверки + рекомендации */}
            <section className={styles.mainGrid}>
                {/* Левая колонка: список AI‑проверок */}
                <div className={styles.leftColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>AI‑проверки по выбранному контуру</span>
                                </div>
                                <h2>Сигналы AI по конструкторским решениям, документации и финансам</h2>
                                <p>
                                    В этом списке показаны AI‑проверки по активному контуру. Каждая проверка имеет
                                    уровень уверенности, масштаб влияния и привязку к узлам, документам или сценариям
                                    финансирования.
                                </p>
                            </div>
                        </header>

                        <div className={styles.checkList}>
                            {domainChecks.map((check) => {
                                const isSelected = check.id === selectedCheckId;
                                const confidenceClass = styles[getConfidenceClass(check.confidence)];
                                const impactClass = styles[getImpactClass(check.impact)];
                                const rowClass = isSelected
                                    ? `${styles.checkRow} ${styles.checkRowActive}`
                                    : styles.checkRow;

                                return (
                                    <button
                                        key={check.id}
                                        type="button"
                                        className={rowClass}
                                        onClick={() => setSelectedCheckId(check.id)}
                                    >
                                        <div className={styles.checkMain}>
                                            <div className={styles.checkTitleRow}>
                                                <span className={styles.checkId}>{check.id}</span>
                                                <span className={styles.checkTitle}>{check.title}</span>
                                            </div>
                                            <p className={styles.checkSummary}>{check.summary}</p>
                                        </div>
                                        <div className={styles.checkMeta}>
                      <span className={`${styles.checkBadge} ${confidenceClass}`}>
                        {getConfidenceLabel(check.confidence)}
                      </span>
                                            <span className={`${styles.checkBadge} ${impactClass}`}>
                        {getImpactLabel(check.impact)}
                      </span>
                                            {check.relatedNode && (
                                                <span className={styles.checkContextBadge}>
                          Узел: {check.relatedNode}
                        </span>
                                            )}
                                            {check.relatedDocCode && (
                                                <span className={styles.checkContextBadge}>
                          Документ: {check.relatedDocCode}
                        </span>
                                            )}
                                            {check.relatedScenario && (
                                                <span className={styles.checkContextBadge}>
                          Сценарий: {check.relatedScenario}
                        </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Правая колонка: инспектор AI‑проверки и рекомендации */}
                <div className={styles.rightColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Инспектор AI‑проверки</span>
                                </div>
                                <h2>Подробности выбранной AI‑проверки и контекст</h2>
                                <p>
                                    В инспекторе можно увидеть контекст проверки: какие данные использовал AI‑слой,
                                    как оценивается уверенность и влияние, и какие узлы, документы или сценарии
                                    затрагиваются.
                                </p>
                            </div>
                        </header>

                        {selectedCheck ? (
                            <>
                                <div className={styles.inspectorGrid}>
                                    <div className={styles.inspectorItem}>
                                        <span>Код и название проверки</span>
                                        <strong>
                                            {selectedCheck.id} · {selectedCheck.title}
                                        </strong>
                                    </div>
                                    <div className={styles.inspectorItem}>
                                        <span>Контур и источник данных</span>
                                        <strong>{getDomainLabel(selectedCheck.domain)} · Workspace/Documentation/Finance</strong>
                                    </div>
                                    <div className={styles.inspectorItem}>
                                        <span>Уровень уверенности и влияние</span>
                                        <strong>
                                            {getConfidenceLabel(selectedCheck.confidence)} · {getImpactLabel(selectedCheck.impact)}
                                        </strong>
                                    </div>
                                    <div className={styles.inspectorItem}>
                                        <span>Привязка к узлу/документу/сценарию</span>
                                        <strong>
                                            {selectedCheck.relatedNode ? `Узел: ${selectedCheck.relatedNode}` : ''}
                                            {selectedCheck.relatedDocCode ? ` · Документ: ${selectedCheck.relatedDocCode}` : ''}
                                            {selectedCheck.relatedScenario ? ` · Сценарий: ${selectedCheck.relatedScenario}` : ''}
                                            {!selectedCheck.relatedNode &&
                                                !selectedCheck.relatedDocCode &&
                                                !selectedCheck.relatedScenario &&
                                                'Контекст построен по агрегированным данным платформы'}
                                        </strong>
                                    </div>
                                </div>

                                <div className={styles.inspectorContext}>
                                    <div className={styles.contextBlock}>
                                        <span className={styles.contextLabel}>Контекст проверки</span>
                                        <p className={styles.contextText}>{selectedCheck.context}</p>
                                    </div>
                                    <div className={styles.contextBlock}>
                                        <span className={styles.contextLabel}>Как AI‑слой использует данные платформы</span>
                                        <p className={styles.contextText}>
                                            Проверка собрана по данным из workspace (узлы и требования), documentation
                                            (пакеты КД и отчётов) и finance (сценарии НИОКР и денежные потоки). В боевом
                                            режиме эти сигналы строятся на основе реальных датчиков, KPI пилота и статуса
                                            согласования документов.
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.emptyInspector}>
                                <p>Проверка не выбрана. Выберите строку слева, чтобы открыть инспектор.</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>AI‑рекомендации по активному контуру</span>
                                </div>
                                <h2>Пакет действий для команды КБ и НИОКР</h2>
                                <p>
                                    Ниже — AI‑рекомендации по выбранному контурy: конкретные действия, которые можно
                                    предпринять, чтобы закрыть выявленные риски и пробелы в документации и финансах.
                                </p>
                            </div>
                        </header>

                        <div className={styles.recommendationList}>
                            {domainRecommendations.map((rec) => {
                                const priorityClass = styles[getPriorityClass(rec.priority)];
                                return (
                                    <div key={rec.id} className={styles.recommendationRow}>
                                        <div className={styles.recommendationMain}>
                                            <span className={styles.recommendationId}>{rec.id}</span>
                                            <span className={styles.recommendationTitle}>{rec.title}</span>
                                            <p className={styles.recommendationDescription}>{rec.description}</p>
                                        </div>
                                        <div className={styles.recommendationMeta}>
                      <span className={`${styles.recommendationBadge} ${priorityClass}`}>
                        {getPriorityLabel(rec.priority)}
                      </span>
                                            <span className={styles.recommendationOwner}>
                        Ответственный: {rec.owner}
                      </span>
                                        </div>
                                    </div>
                                );
                            })}
                            {domainRecommendations.length === 0 && (
                                <div className={styles.emptyRecommendations}>
                                    <p>
                                        Для выбранного контура пока нет явных AI‑рекомендаций. Платформа покажет
                                        действия, когда появятся новые сигналы из КД, документов и финансового контура.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className={styles.nextActionButton}
                            onClick={() => {
                                // простая демонстрация переключения контуров AI
                                setActiveDomainId(
                                    activeDomainId === 'engineering'
                                        ? 'docs'
                                        : activeDomainId === 'docs'
                                            ? 'finance'
                                            : 'engineering'
                                );
                            }}
                        >
                            Переключить AI‑контур (демо‑режим)
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}