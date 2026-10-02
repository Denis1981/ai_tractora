'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './projects.module.css';
import {
    ArrowRight,
    BadgeRussianRuble,
    Bot,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    Filter,
    FolderKanban,
    GitBranch,
    LayoutList,
    Radar,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Tractor,
    Wrench,
} from 'lucide-react';

type ProjectStatus = 'active' | 'pilot' | 'grant' | 'risk' | 'done';
type ProjectPriority = 'high' | 'medium' | 'low';
type ProjectTrack = 'КБ' | 'КД' | 'НИОКР' | 'Финконтур' | 'Интеграции';

type ProjectItem = {
    code: string;
    title: string;
    track: ProjectTrack;
    owner: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    readiness: number;
    docs: number;
    budget: string;
    milestone: string;
    nextAction: string;
    summary: string;
};

const projects: ProjectItem[] = [
    {
        code: 'TR-218',
        title: 'Трансмиссионный узел 2-го контура',
        track: 'КБ',
        owner: 'КБ трансмиссий',
        status: 'pilot',
        priority: 'high',
        readiness: 76,
        docs: 82,
        budget: '18.4 млн ₽',
        milestone: 'Пилотный выпуск rev.04',
        nextAction: 'Закрыть замечания по 3 требованиям',
        summary: 'Ключевой пилотный проект платформы с высокой демонстрационной ценностью для индустриального заказчика.',
    },
    {
        code: 'SK-301',
        title: 'AI-пакет подготовки грантового НИОКР',
        track: 'НИОКР',
        owner: 'Grant office',
        status: 'grant',
        priority: 'high',
        readiness: 82,
        docs: 74,
        budget: '22.7 млн ₽',
        milestone: 'Паспорт проекта и roadmap',
        nextAction: 'Усилить блок технологической новизны',
        summary: 'Контур упаковки проекта под грантовое финансирование и пилотное внедрение.',
    },
    {
        code: 'DOC-81',
        title: 'Ревизионный контур КД',
        track: 'КД',
        owner: 'Документный центр',
        status: 'active',
        priority: 'medium',
        readiness: 72,
        docs: 88,
        budget: '9.6 млн ₽',
        milestone: 'Контроль комплектности',
        nextAction: 'Синхронизировать шаблоны по 2 пакетам',
        summary: 'Модуль выпуска и контроля конструкторской документации с AI-проверкой.',
    },
    {
        code: 'ERP-24',
        title: 'Интеграция с ERP и управленческим контуром',
        track: 'Интеграции',
        owner: 'Enterprise IT',
        status: 'active',
        priority: 'medium',
        readiness: 69,
        docs: 63,
        budget: '14.2 млн ₽',
        milestone: 'Rollout planning',
        nextAction: 'Согласовать справочники и API-узлы',
        summary: 'Интеграционный слой платформы с контуром учета, аналитики и отчетности.',
    },
    {
        code: 'AGM-14',
        title: 'Навесной агрегат серии AGM',
        track: 'КБ',
        owner: 'Проектный офис',
        status: 'risk',
        priority: 'high',
        readiness: 58,
        docs: 64,
        budget: '11.3 млн ₽',
        milestone: 'Структурирование требований',
        nextAction: 'Снять конфликт по 3 зависимым узлам',
        summary: 'Проект с повышенным риском из-за незакрытых инженерных требований и неполного контура решений.',
    },
    {
        code: 'FIN-12',
        title: 'Финансовая модель пилота внедрения',
        track: 'Финконтур',
        owner: 'Финансовый контур',
        status: 'done',
        priority: 'low',
        readiness: 94,
        docs: 91,
        budget: 'Готово',
        milestone: 'Финмодель утверждена',
        nextAction: 'Передать в пакет демонстрации',
        summary: 'Экономическое обоснование пилота, готовое к защите и презентации промышленному заказчику.',
    },
];

const statusOptions = [
    { id: 'all', label: 'Все статусы' },
    { id: 'active', label: 'Активные' },
    { id: 'pilot', label: 'Пилот' },
    { id: 'grant', label: 'Грант' },
    { id: 'risk', label: 'Риск' },
    { id: 'done', label: 'Завершено' },
] as const;

const trackOptions = [
    { id: 'all', label: 'Все треки' },
    { id: 'КБ', label: 'КБ' },
    { id: 'КД', label: 'КД' },
    { id: 'НИОКР', label: 'НИОКР' },
    { id: 'Финконтур', label: 'Финконтур' },
    { id: 'Интеграции', label: 'Интеграции' },
] as const;

function getStatusMeta(status: ProjectStatus) {
    switch (status) {
        case 'pilot':
            return { label: 'Пилот', className: styles.statusPilot, icon: Radar };
        case 'grant':
            return { label: 'Грант', className: styles.statusGrant, icon: BadgeRussianRuble };
        case 'risk':
            return { label: 'Риск', className: styles.statusRisk, icon: CircleAlert };
        case 'done':
            return { label: 'Завершено', className: styles.statusDone, icon: CheckCircle2 };
        default:
            return { label: 'Активен', className: styles.statusActive, icon: Sparkles };
    }
}

function getPriorityClass(priority: ProjectPriority) {
    if (priority === 'high') return styles.priorityHigh;
    if (priority === 'low') return styles.priorityLow;
    return styles.priorityMedium;
}

function ProgressBar({
                         value,
                         tone,
                     }: {
    value: number;
    tone: 'blue' | 'violet';
}) {
    return (
        <div className={styles.progressTrack}>
            <div
                className={`${styles.progressFill} ${tone === 'blue' ? styles.progressBlue : styles.progressViolet}`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

export default function ProjectsPage() {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]['id']>('all');
    const [trackFilter, setTrackFilter] = useState<(typeof trackOptions)[number]['id']>('all');
    const [selectedCode, setSelectedCode] = useState<string>('TR-218');

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesQuery =
                project.code.toLowerCase().includes(query.toLowerCase()) ||
                project.title.toLowerCase().includes(query.toLowerCase()) ||
                project.owner.toLowerCase().includes(query.toLowerCase());

            const matchesStatus = statusFilter === 'all' ? true : project.status === statusFilter;
            const matchesTrack = trackFilter === 'all' ? true : project.track === trackFilter;

            return matchesQuery && matchesStatus && matchesTrack;
        });
    }, [query, statusFilter, trackFilter]);

    const selectedProject =
        filteredProjects.find((project) => project.code === selectedCode) ??
        filteredProjects[0] ??
        projects[0];

    const stats = useMemo(() => {
        const total = filteredProjects.length;
        const active = filteredProjects.filter((item) => item.status === 'active' || item.status === 'pilot').length;
        const risks = filteredProjects.filter((item) => item.status === 'risk').length;
        const avgReadiness = total
            ? Math.round(filteredProjects.reduce((sum, item) => sum + item.readiness, 0) / total)
            : 0;

        return { total, active, risks, avgReadiness };
    }, [filteredProjects]);

    return (
        <main className={styles.page}>
            <div className={styles.orbBlue} />
            <div className={styles.orbViolet} />
            <div className={styles.gridOverlay} />

            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <div className={styles.eyebrow}>
                        <FolderKanban size={16} />
                        TRACTORA AI / Проекты
                    </div>

                    <h1 className={styles.title}>Проектный реестр платформы</h1>
                    <p className={styles.description}>
                        Страница показывает портфель инициатив по КБ, КД, НИОКР, финансовому контуру и интеграциям:
                        статус, готовность, документы, риски и следующие действия по каждому проекту.
                    </p>

                    <div className={styles.heroActions}>
                        <Link href="/panel" className={styles.primaryButton}>
                            Открыть панель управления
                            <ArrowRight size={16} />
                        </Link>

                        <button type="button" className={styles.secondaryButton}>
                            Экспорт проектного среза
                        </button>
                    </div>
                </div>

                <div className={styles.heroStats}>
                    <article className={styles.statCard}>
                        <span>Всего проектов</span>
                        <strong>{stats.total}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Активные контуры</span>
                        <strong>{stats.active}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Зоны риска</span>
                        <strong>{stats.risks}</strong>
                    </article>
                    <article className={styles.statCard}>
                        <span>Средняя готовность</span>
                        <strong>{stats.avgReadiness}%</strong>
                    </article>
                </div>
            </section>

            <section className={styles.filtersRow}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Поиск по коду, проекту или владельцу"
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filtersGroup}>
                    <div className={styles.filterLabel}>
                        <Filter size={14} />
                        Статус
                    </div>

                    <div className={styles.chips}>
                        {statusOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`${styles.chip} ${statusFilter === option.id ? styles.chipActive : ''}`}
                                onClick={() => setStatusFilter(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.filtersGroup}>
                    <div className={styles.filterLabel}>
                        <SlidersHorizontal size={14} />
                        Трек
                    </div>

                    <div className={styles.chips}>
                        {trackOptions.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                className={`${styles.chip} ${trackFilter === option.id ? styles.chipActive : ''}`}
                                onClick={() => setTrackFilter(option.id)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.layout}>
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>
                        <div>
                            <div className={styles.tableEyebrow}>
                                <LayoutList size={15} />
                                Портфель проектов
                            </div>
                            <h2>Операционный список</h2>
                        </div>

                        <div className={styles.tableMeta}>
                            <ShieldCheck size={15} />
                            <span>{filteredProjects.length} записей в выборке</span>
                        </div>
                    </div>

                    <div className={styles.tableWrap}>
                        <div className={styles.tableHead}>
                            <span>Проект</span>
                            <span>Трек</span>
                            <span>Статус</span>
                            <span>Готовность</span>
                            <span>КД</span>
                            <span>Следующий шаг</span>
                        </div>

                        <div className={styles.tableBody}>
                            {filteredProjects.map((project) => {
                                const statusMeta = getStatusMeta(project.status);
                                const StatusIcon = statusMeta.icon;

                                return (
                                    <button
                                        key={project.code}
                                        type="button"
                                        className={`${styles.tableRow} ${selectedProject.code === project.code ? styles.tableRowActive : ''}`}
                                        onClick={() => setSelectedCode(project.code)}
                                    >
                                        <div className={styles.projectCellMain}>
                                            <strong>{project.code}</strong>
                                            <span>{project.title}</span>
                                        </div>

                                        <div className={styles.cellMuted}>{project.track}</div>

                                        <div className={styles.statusCell}>
                      <span className={`${styles.statusBadge} ${statusMeta.className}`}>
                        <StatusIcon size={14} />
                          {statusMeta.label}
                      </span>
                                        </div>

                                        <div className={styles.metricCell}>
                                            <span>{project.readiness}%</span>
                                            <ProgressBar value={project.readiness} tone="blue" />
                                        </div>

                                        <div className={styles.metricCell}>
                                            <span>{project.docs}%</span>
                                            <ProgressBar value={project.docs} tone="violet" />
                                        </div>

                                        <div className={styles.nextActionCell}>
                                            <span>{project.nextAction}</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <aside className={styles.sideCard}>
                    <div className={styles.sideHeader}>
                        <div className={styles.tableEyebrow}>
                            <GitBranch size={15} />
                            Карточка проекта
                        </div>
                        <h3>{selectedProject.code}</h3>
                    </div>

                    <div className={styles.projectHeadline}>
                        <div className={styles.projectIcon}>
                            {selectedProject.track === 'КБ' ? <Wrench size={18} /> : selectedProject.track === 'НИОКР' ? <Bot size={18} /> : selectedProject.track === 'Финконтур' ? <BadgeRussianRuble size={18} /> : selectedProject.track === 'Интеграции' ? <Tractor size={18} /> : <Clock3 size={18} />}
                        </div>

                        <div>
                            <strong>{selectedProject.title}</strong>
                            <p>{selectedProject.summary}</p>
                        </div>
                    </div>

                    <div className={styles.infoList}>
                        <div className={styles.infoItem}>
                            <span>Владелец</span>
                            <strong>{selectedProject.owner}</strong>
                        </div>
                        <div className={styles.infoItem}>
                            <span>Milestone</span>
                            <strong>{selectedProject.milestone}</strong>
                        </div>
                        <div className={styles.infoItem}>
                            <span>Бюджет / эффект</span>
                            <strong>{selectedProject.budget}</strong>
                        </div>
                        <div className={styles.infoItem}>
                            <span>Приоритет</span>
                            <strong className={getPriorityClass(selectedProject.priority)}>
                                {selectedProject.priority === 'high' ? 'Высокий' : selectedProject.priority === 'medium' ? 'Средний' : 'Низкий'}
                            </strong>
                        </div>
                    </div>

                    <div className={styles.sidePanel}>
                        <div className={styles.sidePanelHeader}>Ключевые сигналы</div>

                        <div className={styles.signalList}>
                            <div className={styles.signalItem}>
                                <Sparkles size={14} />
                                AI-контур видит потенциал ускорения инженерного маршрута.
                            </div>
                            <div className={styles.signalItem}>
                                <ShieldCheck size={14} />
                                Документационный пакет движется по контролируемому сценарию.
                            </div>
                            <div className={styles.signalItem}>
                                <CircleAlert size={14} />
                                Следующий шаг требует закрепления ответственного и дедлайна.
                            </div>
                        </div>
                    </div>

                    <Link href="/panel" className={styles.sideLink}>
                        Перейти в панель проекта
                        <ArrowRight size={16} />
                    </Link>
                </aside>
            </section>
        </main>
    );
}