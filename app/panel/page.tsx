'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import styles from './panel.module.css';

type ModuleId = 'workspace' | 'documentation' | 'finance' | 'ai';

type ModuleSummary = {
    id: ModuleId;
    title: string;
    description: string;
    route: string;
    keyMetricLabel: string;
    keyMetricValue: string;
    secondaryMetricLabel: string;
    secondaryMetricValue: string;
};

type AlertSeverity = 'info' | 'warn' | 'critical';

type PanelAlert = {
    id: string;
    title: string;
    description: string;
    moduleId: ModuleId;
    severity: AlertSeverity;
};

const moduleSummaries: ModuleSummary[] = [
    {
        id: 'workspace',
        title: 'Конструкторский контур',
        description:
            'Узлы тракторной платформы, требования и риски. Место, где КБ принимает инженерные решения.',
        route: '/workspace',
        keyMetricLabel: 'Активный узел',
        keyMetricValue: 'Гидросистема и навеска',
        secondaryMetricLabel: 'Требований в фокусе',
        secondaryMetricValue: '5'
    },
    {
        id: 'documentation',
        title: 'Документация и КД',
        description:
            'Пакеты спецификаций, ТЗ, ведомостей изменений и отчётов НИОКР для КБ, пилота и гранта.',
        route: '/documentation',
        keyMetricLabel: 'Активный пакет',
        keyMetricValue: 'Грантовый пакет НИОКР',
        secondaryMetricLabel: 'Документов в наборе',
        secondaryMetricValue: '4'
    },
    {
        id: 'finance',
        title: 'НИОКР и финансирование',
        description:
            'Сценарии финансирования, стадии НИОКР, источники средств и денежные потоки по проекту.',
        route: '/finance',
        keyMetricLabel: 'Активный сценарий',
        keyMetricValue: 'Пилот с индустриальным партнёром',
        secondaryMetricLabel: 'Плановый бюджет',
        secondaryMetricValue: '19,5 млн ₽'
    },
    {
        id: 'ai',
        title: 'AI‑проверки и рекомендации',
        description:
            'AI‑слой, который анализирует КД, документацию и финансы и предлагает действия для команды.',
        route: '/ai',
        keyMetricLabel: 'AI‑проверок',
        keyMetricValue: '5',
        secondaryMetricLabel: 'Рекомендаций',
        secondaryMetricValue: '4'
    }
];

const panelAlerts: PanelAlert[] = [
    {
        id: 'ALERT‑ENG‑01',
        title: 'Конфликт массы навески и ресурса рамы',
        description:
            'AI‑слой фиксирует конфликт требований по массе навески и расчётной нагрузке на раму. Требуется отдельное обоснование для пилотного досье.',
        moduleId: 'workspace',
        severity: 'critical'
    },
    {
        id: 'ALERT‑DOC‑02',
        title: 'Пробел в грантовом пакете по эффекту НИОКР',
        description:
            'В пакете документации для гранта отсутствует развёрнутый блок по ожидаемому отраслевому эффекту от модернизации платформы.',
        moduleId: 'documentation',
        severity: 'warn'
    },
    {
        id: 'ALERT‑FIN‑03',
        title: 'Зависимость пилотного сценария от внешнего финансирования',
        description:
            'Пилотный сценарий по финансам опирается преимущественно на средства индустриального партнёра, что повышает риск по срокам стадий испытаний.',
        moduleId: 'finance',
        severity: 'critical'
    },
    {
        id: 'ALERT‑AI‑04',
        title: 'Низкая уверенность AI‑проверки по связности КД и испытаний',
        description:
            'Одна из AI‑проверок по документации имеет низкую уверенность из‑за неполной связности КД и отчётов испытаний. Платформа рекомендует доуточнить данные.',
        moduleId: 'ai',
        severity: 'info'
    }
];

export default function PanelPage() {
    const totalCritical = useMemo(
        () => panelAlerts.filter((a) => a.severity === 'critical').length,
        []
    );
    const totalWarn = useMemo(
        () => panelAlerts.filter((a) => a.severity === 'warn').length,
        []
    );

    return (
        <div className={styles.page}>
            {/* Верхняя панель управления */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.logoMark}>
                        <span className={styles.logoSymbol}>T</span>
                    </div>
                    <div className={styles.headerTitleBlock}>
                        <div className={styles.headerEyebrow}>
                            <span>TRACTORA AI · Панель управления проектом</span>
                        </div>
                        <h1 className={styles.headerTitle}>
                            Контрольный центр КБ, НИОКР и финансирования по тракторной платформе
                        </h1>
                        <p className={styles.headerDescription}>
                            Здесь команда видит ключевые сигналы по узлам, пакетам документации, финансированию и
                            AI‑рекомендациям. Панель собрана как единое пространство принятия решений по проекту
                            модернизированной тракторной платформы.
                        </p>
                    </div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.headerStatBlock}>
                        <span className={styles.headerStatLabel}>Критичные сигналы</span>
                        <span className={styles.headerStatValue}>{totalCritical}</span>
                    </div>
                    <div className={styles.headerStatBlockMuted}>
                        <span className={styles.headerStatLabel}>Сигналы внимания</span>
                        <span className={styles.headerStatValue}>{totalWarn}</span>
                    </div>
                    <div className={styles.headerStatBlockMuted}>
                        <span className={styles.headerStatLabel}>Проект</span>
                        <span className={styles.headerStatValue}>Тракторная платформа 180–220 л.с.</span>
                    </div>
                </div>
            </header>

            {/* Основная сетка: навигация по модулям + сигналы */}
            <main className={styles.mainGrid}>
                {/* Левая часть: модули платформы */}
                <section className={styles.moduleColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Модули платформы</span>
                                </div>
                                <h2>Структура контуров: КБ, документация, финансы, AI</h2>
                                <p>
                                    Выберите модуль, чтобы перейти к рабочему экрану. Панель показывает ключевые
                                    показатели по каждому контуру и помогает быстро понять, где сейчас фокус внимания.
                                </p>
                            </div>
                        </header>

                        <div className={styles.moduleGrid}>
                            {moduleSummaries.map((module) => (
                                <Link
                                    key={module.id}
                                    href={module.route}
                                    className={styles.moduleCard}
                                >
                                    <div className={styles.moduleCardHeader}>
                                        <span className={styles.moduleTitle}>{module.title}</span>
                                        <span className={styles.moduleRoute}>{module.route}</span>
                                    </div>
                                    <p className={styles.moduleDescription}>{module.description}</p>
                                    <div className={styles.moduleMetricsRow}>
                                        <div className={styles.moduleMetric}>
                                            <span className={styles.moduleMetricLabel}>{module.keyMetricLabel}</span>
                                            <span className={styles.moduleMetricValue}>{module.keyMetricValue}</span>
                                        </div>
                                        <div className={styles.moduleMetric}>
                      <span className={styles.moduleMetricLabel}>
                        {module.secondaryMetricLabel}
                      </span>
                                            <span className={styles.moduleMetricValue}>
                        {module.secondaryMetricValue}
                      </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Правая часть: сигналы и AI‑обзор */}
                <section className={styles.alertColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Сводка сигналов платформы</span>
                                </div>
                                <h2>Сигналы по узлам, документам, финансам и AI‑проверкам</h2>
                                <p>
                                    В этой ленте собраны ключевые сигналы по активному проекту: от инженерных конфликтов
                                    до пробелов в документации и рисков по финансированию. Каждый сигнал связан с
                                    конкретным модулем платформы.
                                </p>
                            </div>
                        </header>

                        <div className={styles.alertList}>
                            {panelAlerts.map((alert) => {
                                let severityClass = styles.alertInfo;
                                if (alert.severity === 'warn') severityClass = styles.alertWarn;
                                if (alert.severity === 'critical') severityClass = styles.alertCritical;

                                return (
                                    <div key={alert.id} className={styles.alertRow}>
                                        <div className={styles.alertHeader}>
                                            <span className={styles.alertId}>{alert.id}</span>
                                            <span className={`${styles.alertSeverity} ${severityClass}`}>
                        {alert.severity === 'info'
                            ? 'Информация'
                            : alert.severity === 'warn'
                                ? 'Внимание'
                                : 'Критично'}
                      </span>
                                        </div>
                                        <h3 className={styles.alertTitle}>{alert.title}</h3>
                                        <p className={styles.alertDescription}>{alert.description}</p>
                                        <div className={styles.alertMeta}>
                      <span className={styles.alertModule}>
                        Модуль:{' '}
                          {alert.moduleId === 'workspace'
                              ? 'Конструкторский контур'
                              : alert.moduleId === 'documentation'
                                  ? 'Документация и КД'
                                  : alert.moduleId === 'finance'
                                      ? 'НИОКР и финансирование'
                                      : 'AI‑проверки и рекомендации'}
                      </span>
                                            <Link
                                                href={
                                                    alert.moduleId === 'workspace'
                                                        ? '/workspace'
                                                        : alert.moduleId === 'documentation'
                                                            ? '/documentation'
                                                            : alert.moduleId === 'finance'
                                                                ? '/finance'
                                                                : '/ai'
                                                }
                                                className={styles.alertLink}
                                            >
                                                Перейти в модуль
                                            </Link>
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
                                    <span>AI‑обзор проекта</span>
                                </div>
                                <h2>Как AI‑слой видит текущий статус проекта</h2>
                                <p>
                                    В этом блоке показана агрегированная оценка: где больше всего рисков, где есть
                                    пробелы в документации и как распределены сигналы между контурами КБ, НИОКР и
                                    финансирования.
                                </p>
                            </div>
                        </header>

                        <div className={styles.aiSummaryGrid}>
                            <div className={styles.aiSummaryItem}>
                                <span className={styles.aiSummaryLabel}>Сигналы по инженерному контуру</span>
                                <strong className={styles.aiSummaryValue}>2 критичных · 1 информационный</strong>
                            </div>
                            <div className={styles.aiSummaryItem}>
                                <span className={styles.aiSummaryLabel}>Сигналы по документации и КД</span>
                                <strong className={styles.aiSummaryValue}>1 сигнал внимания · 1 информационный</strong>
                            </div>
                            <div className={styles.aiSummaryItem}>
                                <span className={styles.aiSummaryLabel}>Сигналы по финансам и НИОКР</span>
                                <strong className={styles.aiSummaryValue}>1 критичный · 1 информационный</strong>
                            </div>
                            <div className={styles.aiSummaryItem}>
                                <span className={styles.aiSummaryLabel}>Положение проекта по оценке AI</span>
                                <strong className={styles.aiSummaryValue}>
                                    Высокий потенциал · Средний риск · Требует проработки пилота и гранта
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}