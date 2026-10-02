import Link from 'next/link';
import styles from './about.module.css';
import {
    ArrowRight,
    BadgeRussianRuble,
    Bot,
    CheckCircle2,
    FileCog,
    FolderKanban,
    Radar,
    ShieldCheck,
    Sparkles,
    Tractor,
    Workflow,
    Wrench,
} from 'lucide-react';

const capabilities = [
    {
        title: 'Инженерный контур',
        text: 'Единая среда для структуры изделия, требований, версий узлов и сценариев разработки в конструкторском бюро.',
        icon: Wrench,
        tone: 'blue',
    },
    {
        title: 'Конструкторская документация',
        text: 'Подготовка черновиков КД, контроль комплектности, ведение изменений и выпуск согласованных пакетов документов.',
        icon: FileCog,
        tone: 'violet',
    },
    {
        title: 'AI-проверки и рекомендации',
        text: 'Проверка противоречий, пропусков, дублирования и рисков по срокам, готовности и инженерной логике проекта.',
        icon: Bot,
        tone: 'teal',
    },
    {
        title: 'НИОКР и финансирование',
        text: 'Сбор цифрового пакета НИОКР: паспорт проекта, эффекты внедрения, бюджет, roadmap пилота и грантовый контур.',
        icon: BadgeRussianRuble,
        tone: 'gold',
    },
] as const;

const pipeline = [
    {
        step: '01',
        title: 'Сбор требований',
        text: 'Фиксация инженерных задач, ограничений, KPI и входных условий по изделию или узлу.',
    },
    {
        step: '02',
        title: 'Структура изделия',
        text: 'Формирование цифровой модели состава изделия, связей узлов, статусов и версий.',
    },
    {
        step: '03',
        title: 'AI-анализ',
        text: 'Проверка логики, полноты, конфликтов и факторов риска в конструкторском и R&D-контуре.',
    },
    {
        step: '04',
        title: 'Документы и пакет НИОКР',
        text: 'Выпуск КД, подготовка материалов под пилот, грант, внедрение и управленческий контур.',
    },
] as const;

const audiences = [
    'Конструкторские бюро тракторостроения.',
    'Промышленные предприятия с программами цифровой трансформации.',
    'R&D-команды, ведущие разработку узлов, агрегатов и новых платформ.',
    'Проектные офисы, отвечающие за пилоты, НИОКР и привлечение финансирования.',
];

const readiness = [
    {
        label: 'Формат продукта',
        value: 'Enterprise demo / pilot-ready',
    },
    {
        label: 'Сценарии',
        value: 'Пилот, грант, внедрение',
    },
    {
        label: 'Архитектура',
        value: 'On-prem / SaaS-ready',
    },
    {
        label: 'Ценность',
        value: 'КБ + КД + AI + НИОКР',
    },
];

export default function AboutPage() {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroGlowBlue} />
                <div className={styles.heroGlowViolet} />

                <div className={styles.heroContent}>
                    <div className={styles.eyebrow}>
                        <Tractor size={16} />
                        <span>О платформе</span>
                    </div>

                    <h1 className={styles.title}>
                        TRACTORA &nbsp;AI — цифровая AI-платформа для КБ и НИОКР в тракторостроении
                    </h1>

                    <p className={styles.lead}>
                        Платформа объединяет инженерный контур, подготовку конструкторской документации,
                        AI-проверки и цифровую упаковку НИОКР для пилотов, внедрения и проектного
                        финансирования.
                    </p>

                    <div className={styles.heroChips}>
                        <div className={styles.chip}>
                            <ShieldCheck size={15} />
                            Demo-ready продукт
                        </div>

                        <div className={`${styles.chip} ${styles.chipMuted}`}>
                            <Radar size={15} />
                            Industrial pilot fit
                        </div>
                    </div>

                    <div className={styles.heroActions}>
                        <Link href="/" className={styles.primaryButton}>
                            На главный экран
                            <ArrowRight size={16} />
                        </Link>

                        <Link href="/panel" className={styles.secondaryButton}>
                            Открыть панель управления
                        </Link>
                    </div>
                </div>

                <aside className={styles.heroAside}>
                    <div className={styles.heroAsideHeader}>
                        <Sparkles size={16} />
                        <span>Ключевая идея</span>
                    </div>

                    <p className={styles.heroAsideText}>
                        Мы превращаем разрозненные процессы конструкторского бюро и R&D в единую цифровую
                        среду, где требования, узлы, документы, проверки и финансовый контур связаны между
                        собой.
                    </p>

                    <div className={styles.heroAsideStats}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>4</span>
                            <span className={styles.statLabel}>ядра платформы</span>
                        </div>

                        <div className={styles.statCard}>
                            <span className={styles.statValue}>3</span>
                            <span className={styles.statLabel}>сценария применения</span>
                        </div>

                        <div className={styles.statCard}>
                            <span className={styles.statValue}>1</span>
                            <span className={styles.statLabel}>единый контур данных</span>
                        </div>
                    </div>
                </aside>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionEyebrow}>Модули платформы</div>
                    <h2 className={styles.sectionTitle}>Что делает TRACTORA &nbsp;AI</h2>
                </div>

                <div className={styles.capabilityGrid}>
                    {capabilities.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.title}
                                className={`${styles.capabilityCard} ${styles[`tone_${item.tone}`]}`}
                            >
                                <div className={styles.capabilityIcon}>
                                    <Icon size={18} />
                                </div>

                                <div className={styles.capabilityTitle}>{item.title}</div>
                                <p className={styles.capabilityText}>{item.text}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionEyebrow}>Логика работы</div>
                    <h2 className={styles.sectionTitle}>Как работает платформа</h2>
                </div>

                <div className={styles.pipeline}>
                    {pipeline.map((item) => (
                        <article key={item.step} className={styles.pipelineCard}>
                            <div className={styles.pipelineStep}>{item.step}</div>
                            <div className={styles.pipelineTitle}>{item.title}</div>
                            <p className={styles.pipelineText}>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.bottomGrid}>
                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <FolderKanban size={16} />
                        Для кого платформа
                    </div>

                    <div className={styles.audienceList}>
                        {audiences.map((item) => (
                            <div key={item} className={styles.audienceItem}>
                                <CheckCircle2 size={16} />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <Workflow size={16} />
                        Готовность и позиционирование
                    </div>

                    <div className={styles.readinessList}>
                        {readiness.map((item) => (
                            <div key={item.label} className={styles.readinessItem}>
                                <span className={styles.readinessLabel}>{item.label}</span>
                                <span className={styles.readinessValue}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.noteBox}>
                        Платформа проектируется как демонстрационный MVP для промышленного заказчика, пилота
                        и грантового трека с возможностью дальнейшего развития в enterprise-систему.
                    </div>
                </article>
            </section>
        </main>
    );
}