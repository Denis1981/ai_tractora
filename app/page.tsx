'use client';

import styles from './tractor/page.module.css';

import { useMemo, useState } from 'react';
import {
    ArrowRight,
    BadgeRussianRuble,
    Bot,
    BrainCircuit,
    CheckCircle2,
    CircleAlert,
    Clock3,
    FileCog,
    FileSpreadsheet,
    Filter,
    FolderKanban,
    Gauge,
    GitBranch,
    LayoutGrid,
    type LucideIcon,
    PackageCheck,
    Radar,
    ShieldCheck,
    Sparkles,
    Tractor,
    Workflow,
    Wrench,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type ScenarioId = 'pilot' | 'grant' | 'production';
type ModuleId = 'overview' | 'engineering' | 'docs' | 'finance';
type RiskLevel = 'Низкий' | 'Средний' | 'Высокий';

type KpiItem = {
    title: string;
    value: string;
    note: string;
    tone: 'blue' | 'violet' | 'teal' | 'gold';
};

type ProjectItem = {
    code: string;
    name: string;
    stage: string;
    docs: string;
    risk: RiskLevel;
    owner: string;
};

type AlertItem = {
    level: 'info' | 'warn' | 'success';
    text: string;
};

type FeedItem = {
    time: string;
    text: string;
};

type ChartPoint = {
    name: string;
    readiness: number;
    docs: number;
    finance: number;
};

type NodeItem = {
    id: string;
    title: string;
    text: string;
    tone: 'blue' | 'teal' | 'violet' | 'orange' | 'gold' | 'red';
};

type ScenarioData = {
    title: string;
    subtitle: string;
    status: string;
    focus: string;
    kpis: KpiItem[];
    chart: ChartPoint[];
    projects: ProjectItem[];
    alerts: AlertItem[];
    feed: FeedItem[];
    nodes: NodeItem[];
    quickStats: {
        label: string;
        value: string;
    }[];
};

const moduleTabs: { id: ModuleId; label: string; icon: LucideIcon }[] = [
    { id: 'overview', label: 'Обзор', icon: LayoutGrid },
    { id: 'engineering', label: 'Инженерный контур', icon: Workflow },
    { id: 'docs', label: 'Документация', icon: FileCog },
    { id: 'finance', label: 'НИОКР и финансирование', icon: BadgeRussianRuble },
];

const scenarioConfig: Record<ScenarioId, ScenarioData> = {
    pilot: {
        title: 'Пилот AI-платформы для КБ',
        subtitle:
            'Контур подготовки КД, проверки изменений и сопровождения НИОКР для тракторных узлов и производственных изделий.',
        status: 'Пилотный сценарий активен',
        focus: 'Фокус: инженерный контур и AI-проверка',
        kpis: [
            { title: 'Активные задачи', value: '14', note: '3 проекта в работе', tone: 'blue' },
            { title: 'Готовность КД', value: '76%', note: '9 комплектов в контуре', tone: 'violet' },
            { title: 'Экономия времени', value: '18.4%', note: 'на выпуск черновиков', tone: 'teal' },
            { title: 'AI-проверки', value: '248', note: '91% без критических ошибок', tone: 'gold' },
        ],
        chart: [
            { name: 'Янв', readiness: 39, docs: 24, finance: 16 },
            { name: 'Фев', readiness: 46, docs: 31, finance: 19 },
            { name: 'Мар', readiness: 52, docs: 38, finance: 28 },
            { name: 'Апр', readiness: 58, docs: 47, finance: 36 },
            { name: 'Май', readiness: 65, docs: 56, finance: 44 },
            { name: 'Июн', readiness: 71, docs: 64, finance: 53 },
            { name: 'Июл', readiness: 76, docs: 72, finance: 61 },
        ],
        projects: [
            {
                code: 'TR-218',
                name: 'Трансмиссионный модуль 2.1',
                stage: 'Согласование',
                docs: '76%',
                risk: 'Средний',
                owner: 'КБ-1',
            },
            {
                code: 'AGM-14',
                name: 'Навесной агрегат',
                stage: 'Разработка',
                docs: '64%',
                risk: 'Высокий',
                owner: 'КБ-2',
            },
            {
                code: 'KIP-07',
                name: 'AI-контроль КД',
                stage: 'Проверка',
                docs: '82%',
                risk: 'Низкий',
                owner: 'AI-группа',
            },
        ],
        alerts: [
            {
                level: 'warn',
                text: 'Найден конфликт версий в спецификации трансмиссионного узла.',
            },
            {
                level: 'info',
                text: '84% требований уже покрыты комплектом документации.',
            },
            {
                level: 'warn',
                text: 'Нужна актуализация сметы НИОКР перед защитой пилота.',
            },
            {
                level: 'success',
                text: 'Проект TR-218 прошел AI-проверку структуры изделия.',
            },
        ],
        feed: [
            { time: '09:10', text: 'TR-218 rev.04 отправлен в инженерную проверку.' },
            { time: '10:25', text: 'AI-модуль выявил расхождение в маршрутной логике.' },
            { time: '11:40', text: 'Обновлен комплект пояснительной записки.' },
            { time: '12:05', text: 'Подтвержден KPI пилота по сокращению цикла КД.' },
        ],
        nodes: [
            {
                id: 'REQ',
                title: 'Требования',
                text: 'Сбор ТЗ, параметров и KPI проекта.',
                tone: 'blue',
            },
            {
                id: 'BOM',
                title: 'Структура изделия',
                text: 'Узлы, состав, версии и зависимости.',
                tone: 'teal',
            },
            {
                id: 'AI',
                title: 'AI-проверка',
                text: 'Поиск конфликтов, пропусков и рисков.',
                tone: 'violet',
            },
            {
                id: 'DOC',
                title: 'Документы',
                text: 'Черновики КД, ведомости, пояснительные.',
                tone: 'orange',
            },
            {
                id: 'RND',
                title: 'НИОКР',
                text: 'Этапы, бюджет, эффекты, готовность.',
                tone: 'gold',
            },
            {
                id: 'FIN',
                title: 'Финконтур',
                text: 'Паспорт проекта и упаковка под финансирование.',
                tone: 'red',
            },
        ],
        quickStats: [
            { label: 'Ключевой проект', value: 'TR-218' },
            { label: 'Режим', value: 'Pilot Demo' },
            { label: 'Следующий шаг', value: 'AI-проверка КД' },
        ],
    },

    grant: {
        title: 'Грантовый сценарий AI-платформы',
        subtitle:
            'Подготовка цифрового пакета для проектного финансирования НИОКР, защиты эффекта и доработки технологии.',
        status: 'Грантовая упаковка активна',
        focus: 'Фокус: эффекты, KPI и обоснование внедрения',
        kpis: [
            { title: 'Готовность заявки', value: '82%', note: 'основной пакет почти собран', tone: 'blue' },
            { title: 'Пакеты документов', value: '6', note: '2 в финальной стадии', tone: 'violet' },
            { title: 'Оценка эффекта', value: '22.7%', note: 'по целевому циклу НИОКР', tone: 'teal' },
            { title: 'Покрытие KPI', value: '68%', note: 'метрики уже формализованы', tone: 'gold' },
        ],
        chart: [
            { name: 'Янв', readiness: 31, docs: 28, finance: 20 },
            { name: 'Фев', readiness: 36, docs: 33, finance: 28 },
            { name: 'Мар', readiness: 41, docs: 41, finance: 37 },
            { name: 'Апр', readiness: 49, docs: 48, finance: 45 },
            { name: 'Май', readiness: 57, docs: 57, finance: 56 },
            { name: 'Июн', readiness: 69, docs: 66, finance: 68 },
            { name: 'Июл', readiness: 82, docs: 74, finance: 79 },
        ],
        projects: [
            {
                code: 'SK-301',
                name: 'AI-модуль экспертизы КД',
                stage: 'Упаковка заявки',
                docs: '82%',
                risk: 'Средний',
                owner: 'Grant Desk',
            },
            {
                code: 'TR-218',
                name: 'Тракторный узел',
                stage: 'Подготовка пилота',
                docs: '74%',
                risk: 'Средний',
                owner: 'КБ-1',
            },
            {
                code: 'DOC-11',
                name: 'Комплект обоснований',
                stage: 'Финализация',
                docs: '67%',
                risk: 'Высокий',
                owner: 'PMO',
            },
        ],
        alerts: [
            {
                level: 'warn',
                text: 'Нужно уточнить финансовую модель сопровождения внедрения.',
            },
            {
                level: 'info',
                text: 'Сформирован базовый пакет KPI для индустриального пилота.',
            },
            {
                level: 'warn',
                text: 'Часть технических эффектов пока не подтверждена цифрами заказчика.',
            },
            {
                level: 'success',
                text: 'Черновик заявки собран и синхронизирован с дорожной картой MVP.',
            },
        ],
        feed: [
            { time: '08:45', text: 'Обновлен паспорт проекта для грантового сценария.' },
            { time: '10:05', text: 'Собраны целевые KPI по времени выпуска КД.' },
            { time: '11:20', text: 'Подтянуты блоки по рынку и внедрению.' },
            { time: '13:00', text: 'Сформирован реестр рисков и мер снижения.' },
        ],
        nodes: [
            {
                id: 'TASK',
                title: 'Задача',
                text: 'Проблема отрасли и сценарий внедрения.',
                tone: 'blue',
            },
            {
                id: 'TECH',
                title: 'Технология',
                text: 'AI-ядро, модули и логика обработки.',
                tone: 'teal',
            },
            {
                id: 'VALUE',
                title: 'Эффект',
                text: 'Сокращение цикла, качество КД, контроль НИОКР.',
                tone: 'violet',
            },
            {
                id: 'DOC',
                title: 'Пакет',
                text: 'Паспорт, смета, дорожная карта, KPI.',
                tone: 'orange',
            },
            {
                id: 'RND',
                title: 'НИОКР',
                text: 'TRL, этапность и потребность в доработке.',
                tone: 'gold',
            },
            {
                id: 'GRANT',
                title: 'Финансирование',
                text: 'Готовность к подаче и логика пилота.',
                tone: 'red',
            },
        ],
        quickStats: [
            { label: 'Приоритет', value: 'Grant Pack' },
            { label: 'Готовность', value: '82%' },
            { label: 'Следующий шаг', value: 'Финализация KPI' },
        ],
    },

    production: {
        title: 'Промышленная эксплуатация платформы',
        subtitle:
            'Контур интеграции в инженерную и управленческую среду предприятия: КБ, документы, BI, маршруты, финконтур.',
        status: 'Контур масштабирования активен',
        focus: 'Фокус: интеграция, маршруты, BI и контроль изменений',
        kpis: [
            { title: 'Интеграции', value: '9', note: 'ERP, архив, BI, маршруты', tone: 'blue' },
            { title: 'Согласованность КД', value: '79%', note: 'единый цифровой контур', tone: 'violet' },
            { title: 'Ускорение цикла', value: '1.7x', note: 'на типовых сценариях', tone: 'teal' },
            { title: 'Маршруты контроля', value: '12', note: 'сквозные бизнес-потоки', tone: 'gold' },
        ],
        chart: [
            { name: 'Янв', readiness: 45, docs: 36, finance: 29 },
            { name: 'Фев', readiness: 49, docs: 41, finance: 34 },
            { name: 'Мар', readiness: 55, docs: 47, finance: 38 },
            { name: 'Апр', readiness: 63, docs: 55, finance: 46 },
            { name: 'Май', readiness: 69, docs: 61, finance: 54 },
            { name: 'Июн', readiness: 75, docs: 68, finance: 62 },
            { name: 'Июл', readiness: 79, docs: 74, finance: 70 },
        ],
        projects: [
            {
                code: 'ERP-24',
                name: 'Интеграция с ERP',
                stage: 'Внедрение',
                docs: '79%',
                risk: 'Средний',
                owner: 'IT Enterprise',
            },
            {
                code: 'TR-218',
                name: 'Контур КБ',
                stage: 'Эксплуатация',
                docs: '81%',
                risk: 'Низкий',
                owner: 'КБ-1',
            },
            {
                code: 'DOC-81',
                name: 'Архив и версии',
                stage: 'Стабилизация',
                docs: '72%',
                risk: 'Средний',
                owner: 'Data Office',
            },
        ],
        alerts: [
            {
                level: 'info',
                text: 'BI-слой подключен к данным по этапам НИОКР.',
            },
            {
                level: 'warn',
                text: 'Требуется нормализация старых комплектов документации.',
            },
            {
                level: 'success',
                text: 'Маршрут согласования изменений успешно автоматизирован.',
            },
            {
                level: 'info',
                text: 'AI-проверка встроена в цикл выпуска документации.',
            },
        ],
        feed: [
            { time: '09:00', text: 'Синхронизация статусов между КБ и ERP завершена.' },
            { time: '10:40', text: 'Обновлена матрица прав для проектных ролей.' },
            { time: '12:15', text: 'Подтвержден переход на единый журнал изменений.' },
            { time: '14:05', text: 'Построен отчет по эффектам внедрения за месяц.' },
        ],
        nodes: [
            {
                id: 'FLOW',
                title: 'Потоки',
                text: 'Связь инженерного и управленческого контура.',
                tone: 'blue',
            },
            {
                id: 'ENG',
                title: 'КБ',
                text: 'Изделия, версии, изменения, контроль.',
                tone: 'teal',
            },
            {
                id: 'AI',
                title: 'AI-ядро',
                text: 'Подсказки, проверки, рекомендации.',
                tone: 'violet',
            },
            {
                id: 'DOC',
                title: 'Документы',
                text: 'Автоматизация КД и реестр комплектов.',
                tone: 'orange',
            },
            {
                id: 'RND',
                title: 'НИОКР',
                text: 'Этапность, ресурсы, результаты.',
                tone: 'gold',
            },
            {
                id: 'INT',
                title: 'Интеграции',
                text: 'ERP, архив, BI, финансирование.',
                tone: 'red',
            },
        ],
        quickStats: [
            { label: 'Контур', value: 'Enterprise' },
            { label: 'Интеграции', value: '9 систем' },
            { label: 'Следующий шаг', value: 'BI-аналитика' },
        ],
    },
};

function cx(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(' ');
}

function getKpiToneClass(tone: KpiItem['tone']) {
    if (tone === 'blue') return styles.kpiToneBlue;
    if (tone === 'violet') return styles.kpiToneViolet;
    if (tone === 'teal') return styles.kpiToneTeal;
    return styles.kpiToneGold;
}

function getNodeToneClass(tone: NodeItem['tone']) {
    if (tone === 'blue') return styles.nodeBlue;
    if (tone === 'teal') return styles.nodeTeal;
    if (tone === 'violet') return styles.nodeViolet;
    if (tone === 'orange') return styles.nodeOrange;
    if (tone === 'gold') return styles.nodeGold;
    return styles.nodeRed;
}

function getRiskClassName(risk: RiskLevel) {
    if (risk === 'Низкий') return styles.riskLow;
    if (risk === 'Высокий') return styles.riskHigh;
    return styles.riskMedium;
}

function getAlertMeta(level: AlertItem['level']) {
    if (level === 'success') {
        return {
            icon: CheckCircle2,
            className: styles.alertSuccess,
            label: 'Подтверждено',
        };
    }

    if (level === 'warn') {
        return {
            icon: CircleAlert,
            className: styles.alertWarn,
            label: 'Внимание',
        };
    }

    return {
        icon: Sparkles,
        className: styles.alertInfo,
        label: 'Событие',
    };
}

export default function HomePage() {
    const [scenario, setScenario] = useState<ScenarioId>('pilot');
    const [activeModule, setActiveModule] = useState<ModuleId>('overview');
    const [selectedProjectCode, setSelectedProjectCode] = useState<string>('TR-218');

    const currentData = scenarioConfig[scenario];

    const selectedProject =
        currentData.projects.find((project) => project.code === selectedProjectCode) ??
        currentData.projects[0];

    const inspectorItems = useMemo(() => {
        if (activeModule === 'engineering') {
            return [
                ['Активный узел', selectedProject.name],
                ['Стадия', selectedProject.stage],
                ['Владелец', selectedProject.owner],
                ['Риск', selectedProject.risk],
                ['Готовность КД', selectedProject.docs],
            ];
        }

        if (activeModule === 'docs') {
            return [
                ['Ведущий пакет', 'Спецификация изделия'],
                ['Черновая готовность', selectedProject.docs],
                ['AI-автозаполнение', scenario === 'grant' ? '68%' : '72%'],
                [
                    'Статус согласования',
                    scenario === 'production' ? 'Маршрут активен' : 'Требует проверки',
                ],
                ['Следующий выпуск', 'Ведомость изменений'],
            ];
        }

        if (activeModule === 'finance') {
            return [
                [
                    'Сценарий',
                    scenario === 'grant'
                        ? 'Грантовый'
                        : scenario === 'pilot'
                            ? 'Пилотный'
                            : 'Промышленный',
                ],
                [
                    'Оценка эффекта',
                    scenario === 'grant'
                        ? '22.7%'
                        : scenario === 'pilot'
                            ? '18.4%'
                            : '1.7x',
                ],
                ['Бюджетный фокус', 'НИОКР и внедрение'],
                ['Статус пакета', currentData.status],
                ['Следующий шаг', currentData.quickStats[2]?.value ?? 'Уточняется'],
            ];
        }

        return [
            ['Активный проект', selectedProject.code],
            ['Название', selectedProject.name],
            ['Статус контура', currentData.status],
            ['Приоритет', currentData.focus],
            ['Фокус модуля', 'Единый обзор платформы'],
        ];
    }, [activeModule, currentData, scenario, selectedProject]);

    const moduleSummary = useMemo(() => {
        if (activeModule === 'engineering') {
            return 'Рабочее пространство конструктора: состав изделия, проектные узлы, версии и AI-проверки.';
        }
        if (activeModule === 'docs') {
            return 'Контур автоформирования КД: спецификации, ведомости, пояснительные записки и контроль комплектности.';
        }
        if (activeModule === 'finance') {
            return 'Контур НИОКР и финансирования: эффект, бюджет, паспорт проекта и логика пилотного запуска.';
        }
        return 'Единая панель платформы: KPI, маршрут данных, реестр проектов, события и AI-подсказки.';
    }, [activeModule]);

    return (
        <main className={styles.page}>
            <div className={styles.backdropOrbBlue} />
            <div className={styles.backdropOrbViolet} />
            <div className={styles.backdropGrid} />

            <div className={styles.container}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroEyebrow}>
                            <Tractor size={16} />
                            TRACTORA AI
                        </div>

                        <h1 className={styles.heroTitle}>
                            AI-платформа для КБ и НИОКР в тракторостроении
                        </h1>

                        <p className={styles.heroText}>{currentData.subtitle}</p>

                        <div className={styles.heroStatusRow}>
                            <div className={styles.heroStatusCard}>
                                <ShieldCheck size={16} />
                                <span>{currentData.status}</span>
                            </div>

                            <div className={styles.heroStatusCardMuted}>
                                <Clock3 size={16} />
                                <span>{currentData.focus}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.heroAside}>
                        <div className={styles.heroAsideTitle}>Сценарий демонстрации</div>

                        <div className={styles.switcher}>
                            <button
                                type="button"
                                className={cx(
                                    styles.switcherButton,
                                    scenario === 'pilot' && styles.switcherButtonActive
                                )}
                                onClick={() => {
                                    setScenario('pilot');
                                    setSelectedProjectCode('TR-218');
                                }}
                            >
                                Пилот
                            </button>

                            <button
                                type="button"
                                className={cx(
                                    styles.switcherButton,
                                    scenario === 'grant' && styles.switcherButtonActive
                                )}
                                onClick={() => {
                                    setScenario('grant');
                                    setSelectedProjectCode('SK-301');
                                }}
                            >
                                Грант
                            </button>

                            <button
                                type="button"
                                className={cx(
                                    styles.switcherButton,
                                    scenario === 'production' &&
                                    styles.switcherButtonActive
                                )}
                                onClick={() => {
                                    setScenario('production');
                                    setSelectedProjectCode('ERP-24');
                                }}
                            >
                                Внедрение
                            </button>
                        </div>

                        <div className={styles.ctaRow}>
                            <motion.button
                                type="button"
                                className={styles.primaryButton}
                                whileHover={{ y: -2, scale: 1.01 }}
                                whileTap={{ scale: 0.985 }}
                                onClick={() => setActiveModule('engineering')}
                            >
                                Открыть инженерный контур
                                <ArrowRight size={16} />
                            </motion.button>

                            <motion.button
                                type="button"
                                className={styles.secondaryButton}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.985 }}
                                onClick={() => setActiveModule('finance')}
                            >
                                Показать пакет НИОКР
                            </motion.button>
                        </div>
                    </div>
                </section>

                <section className={styles.tabs}>
                    {moduleTabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeModule === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                className={cx(styles.tabButton, active && styles.tabButtonActive)}
                                onClick={() => setActiveModule(tab.id)}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </section>

                <section className={styles.kpiGrid}>
                    {currentData.kpis.map((item, index) => (
                        <motion.article
                            key={`${scenario}-${item.title}`}
                            className={cx(styles.kpiCard, getKpiToneClass(item.tone))}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: index * 0.05 }}
                        >
                            <div className={styles.kpiTitle}>{item.title}</div>
                            <div className={styles.kpiValue}>{item.value}</div>
                            <div className={styles.kpiNote}>{item.note}</div>
                        </motion.article>
                    ))}
                </section>

                <section className={styles.dashboardGrid}>
                    <div className={styles.dashboardMain}>
                        <article className={styles.panelCard}>
                            <div className={styles.panelBody}>
                                <div className={styles.panelHeader}>
                                    <div>
                                        <div className={styles.panelEyebrow}>
                                            <Gauge size={15} />
                                            Динамика платформы
                                        </div>
                                        <h2 className={styles.panelTitle}>{currentData.title}</h2>
                                        <p className={styles.panelText}>{moduleSummary}</p>
                                    </div>

                                    <div className={styles.miniStats}>
                                        {currentData.quickStats.map((item) => (
                                            <div className={styles.miniStat} key={item.label}>
                                                <span className={styles.miniStatLabel}>
                                                    {item.label}
                                                </span>
                                                <strong className={styles.miniStatValue}>
                                                    {item.value}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.chartBox}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={currentData.chart}
                                            margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="colorReadiness"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#38bdf8"
                                                        stopOpacity={0.42}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#38bdf8"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="colorDocs"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#8b5cf6"
                                                        stopOpacity={0.32}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#8b5cf6"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="colorFinance"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#14b8a6"
                                                        stopOpacity={0.22}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#14b8a6"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid
                                                stroke="rgba(148,163,184,0.09)"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#6f83a7"
                                                tickLine={false}
                                                axisLine={false}
                                                fontSize={12}
                                            />
                                            <YAxis
                                                stroke="#6f83a7"
                                                tickLine={false}
                                                axisLine={false}
                                                fontSize={12}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: '#0f172a',
                                                    border: '1px solid rgba(148,163,184,0.16)',
                                                    borderRadius: 14,
                                                    boxShadow:
                                                        '0 16px 40px rgba(0,0,0,0.28)',
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="readiness"
                                                name="Зрелость контура"
                                                stroke="#38bdf8"
                                                fill="url(#colorReadiness)"
                                                strokeWidth={3}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="docs"
                                                name="Готовность КД"
                                                stroke="#8b5cf6"
                                                fill="url(#colorDocs)"
                                                strokeWidth={2.4}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="finance"
                                                name="Финансовый контур"
                                                stroke="#14b8a6"
                                                fill="url(#colorFinance)"
                                                strokeWidth={2.1}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </article>

                        <article className={styles.panelCard}>
                            <div className={styles.panelBody}>
                                <div className={cx(styles.panelHeader, styles.panelHeaderCompact)}>
                                    <div>
                                        <div className={styles.panelEyebrow}>
                                            <GitBranch size={15} />
                                            Рабочий маршрут
                                        </div>
                                        <h2 className={styles.panelTitle}>
                                            Сквозной контур платформы
                                        </h2>
                                        <p className={styles.panelText}>
                                            Данные внизу меняются при переключении сценария и модуля,
                                            чтобы экран выглядел как живой product prototype, а не
                                            статичная картинка.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.ghostButton}
                                        onClick={() =>
                                            setActiveModule((prev) =>
                                                prev === 'overview'
                                                    ? 'engineering'
                                                    : prev === 'engineering'
                                                        ? 'docs'
                                                        : prev === 'docs'
                                                            ? 'finance'
                                                            : 'overview'
                                            )
                                        }
                                    >
                                        <Filter size={14} />
                                        Сменить фокус
                                    </button>
                                </div>

                                <div className={styles.workflowGrid}>
                                    {currentData.nodes.map((node) => (
                                        <div
                                            key={`${scenario}-${node.id}`}
                                            className={styles.workflowNode}
                                        >
                                            <div
                                                className={cx(
                                                    styles.workflowNodeId,
                                                    getNodeToneClass(node.tone)
                                                )}
                                            >
                                                {node.id}
                                            </div>
                                            <h3 className={styles.workflowNodeTitle}>
                                                {node.title}
                                            </h3>
                                            <p className={styles.workflowNodeText}>{node.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.workflowLineBlock}>
                                    <div className={styles.workflowLine} />
                                    <div className={styles.workflowLineCaption}>
                                        ТЗ → состав изделия → AI-проверки → КД → НИОКР → пилот /
                                        грант / внедрение
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article className={styles.panelCard}>
                            <div className={styles.panelBody}>
                                <div className={cx(styles.panelHeader, styles.panelHeaderCompact)}>
                                    <div>
                                        <div className={styles.panelEyebrow}>
                                            <FolderKanban size={15} />
                                            Реестр проектов
                                        </div>
                                        <h2 className={styles.panelTitle}>
                                            Активные контуры и изделия
                                        </h2>
                                        <p className={styles.panelText}>
                                            Нажатие на строку меняет инспектор справа и общий фокус
                                            рабочего экрана.
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.tableWrap}>
                                    <table className={styles.projectsTable}>
                                        <thead>
                                        <tr>
                                            <th>Код</th>
                                            <th>Проект</th>
                                            <th>Стадия</th>
                                            <th>КД</th>
                                            <th>Риск</th>
                                            <th>Ответственный</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentData.projects.map((project) => {
                                            const active = selectedProjectCode === project.code;

                                            return (
                                                <tr
                                                    key={project.code}
                                                    className={cx(
                                                        styles.projectsRow,
                                                        active && styles.projectsRowActive
                                                    )}
                                                    onClick={() =>
                                                        setSelectedProjectCode(project.code)
                                                    }
                                                >
                                                    <td>{project.code}</td>
                                                    <td>{project.name}</td>
                                                    <td>{project.stage}</td>
                                                    <td>{project.docs}</td>
                                                    <td>
                                                            <span
                                                                className={cx(
                                                                    styles.riskPill,
                                                                    getRiskClassName(project.risk)
                                                                )}
                                                            >
                                                                {project.risk}
                                                            </span>
                                                    </td>
                                                    <td>{project.owner}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </article>
                    </div>

                    <aside className={styles.dashboardSide}>
                        <article className={styles.panelCard}>
                            <div className={styles.panelBody}>
                                <div className={styles.panelEyebrow}>
                                    <Radar size={15} />
                                    Инспектор состояния
                                </div>

                                <h2 className={styles.panelTitle}>{selectedProject.code}</h2>
                                <p className={styles.inspectorSubtitle}>
                                    {selectedProject.name}
                                </p>

                                <div className={styles.inspectorList}>
                                    {inspectorItems.map(([label, value]) => (
                                        <div className={styles.inspectorRow} key={label}>
                                            <span className={styles.inspectorKey}>{label}</span>
                                            <strong className={styles.inspectorValue}>{value}</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>

                        <article className={styles.panelCard}>
                            <div className={styles.panelBody}>
                                <div className={cx(styles.panelHeader, styles.panelHeaderCompact)}>
                                    <div>
                                        <div className={styles.panelEyebrow}>
                                            <Bot size={15} />
                                            AI-рекомендации
                                        </div>
                                        <h2 className={styles.panelTitle}>События и сигналы</h2>
                                        <p className={styles.panelText}>
                                            Блок меняется при выборе сценария и показывает
                                            правдоподобный рабочий контур.
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.alertList}>
                                    {currentData.alerts.map((alert, index) => {
                                        const meta = getAlertMeta(alert.level);
                                        const Icon = meta.icon;

                                        return (
                                            <motion.div
                                                key={`${scenario}-${alert.text}`}
                                                className={cx(styles.alertItem, meta.className)}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    duration: 0.22,
                                                    delay: index * 0.05,
                                                }}
                                            >
                                                <div className={styles.alertIcon}>
                                                    <Icon size={15} />
                                                </div>
                                                <div>
                                                    <span className={styles.alertLabel}>
                                                        {meta.label}
                                                    </span>
                                                    <p className={styles.alertText}>{alert.text}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </article>

                        <article className={styles.panelCard}>
                            <div className={styles.panelBody}>
                                <div className={cx(styles.panelHeader, styles.panelHeaderCompact)}>
                                    <div>
                                        <div className={styles.panelEyebrow}>
                                            <FileSpreadsheet size={15} />
                                            Журнал контура
                                        </div>
                                        <h2 className={styles.panelTitle}>События рабочего дня</h2>
                                    </div>
                                </div>

                                <div className={styles.feedList}>
                                    {currentData.feed.map((item) => (
                                        <div
                                            className={styles.feedRow}
                                            key={`${item.time}-${item.text}`}
                                        >
                                            <div className={styles.feedTime}>{item.time}</div>
                                            <div className={styles.feedText}>{item.text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </article>

                        <article className={styles.panelCard}>
                            <div className={styles.panelBody}>
                                <div className={styles.panelEyebrow}>
                                    <Wrench size={15} />
                                    Быстрые действия
                                </div>

                                <div className={styles.actionList}>
                                    <motion.button
                                        type="button"
                                        className={styles.actionButton}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.985 }}
                                        onClick={() => setActiveModule('docs')}
                                    >
                                        <div>
                                            <strong className={styles.actionButtonTitle}>
                                                Сформировать пакет КД
                                            </strong>
                                            <span className={styles.actionButtonText}>
                                                Спецификация, ведомость, пояснительная записка
                                            </span>
                                        </div>
                                        <FileCog size={17} />
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        className={styles.actionButton}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.985 }}
                                        onClick={() => setActiveModule('engineering')}
                                    >
                                        <div>
                                            <strong className={styles.actionButtonTitle}>
                                                Открыть инженерный контур
                                            </strong>
                                            <span className={styles.actionButtonText}>
                                                Состав изделия, узлы, версии, AI-проверки
                                            </span>
                                        </div>
                                        <PackageCheck size={17} />
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        className={styles.actionButton}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.985 }}
                                        onClick={() => setActiveModule('finance')}
                                    >
                                        <div>
                                            <strong className={styles.actionButtonTitle}>
                                                Показать контур НИОКР
                                            </strong>
                                            <span className={styles.actionButtonText}>
                                                Бюджет, эффект, паспорт проекта, дорожная карта
                                            </span>
                                        </div>
                                        <BrainCircuit size={17} />
                                    </motion.button>
                                </div>
                            </div>
                        </article>
                    </aside>
                </section>
            </div>
        </main>
    );
}