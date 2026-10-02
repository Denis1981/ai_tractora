'use client';

import { useMemo, useState } from 'react';
import styles from './documentation.module.css';

type DocType = 'spec' | 'tz' | 'change_log' | 'test_report' | 'rnd_report' | 'pilot_dossier';
type DocStatus = 'draft' | 'in_review' | 'approved';
type FlowStage = 'kb' | 'production' | 'finance' | 'grant';

type DocItem = {
    id: string;
    code: string;
    title: string;
    type: DocType;
    status: DocStatus;
    owner: string;
    stage: FlowStage;
    node: string;
    updatedAt: string;
};

type PacketId = 'kb_packet' | 'pilot_packet' | 'grant_packet';

type Packet = {
    id: PacketId;
    label: string;
    description: string;
    focus: string;
    docs: string[]; // doc codes
    readiness: number;
    risk: 'low' | 'medium' | 'high';
};

type FlowHintId = 'structure' | 'consistency' | 'finance' | 'grant';

type FlowHint = {
    id: FlowHintId;
    title: string;
    text: string;
};

const docItems: DocItem[] = [
    {
        id: 'DOC‑SP‑TR‑001',
        code: 'SP‑TR‑001',
        title: 'Спецификация тракторной платформы 180–220 л.с.',
        type: 'spec',
        status: 'in_review',
        owner: 'КБ тракторостроения',
        stage: 'kb',
        node: 'Рама и силовая структура',
        updatedAt: '24.07.2026'
    },
    {
        id: 'DOC‑TZ‑HYD‑003',
        code: 'TZ‑HYD‑003',
        title: 'Техническое задание на модернизацию гидросистемы навески',
        type: 'tz',
        status: 'draft',
        owner: 'Отдел гидросистем',
        stage: 'kb',
        node: 'Гидросистема и навеска',
        updatedAt: '23.07.2026'
    },
    {
        id: 'DOC‑CL‑TR‑015',
        code: 'CL‑TR‑015',
        title: 'Ведомость изменений по силовой структуре рамы',
        type: 'change_log',
        status: 'in_review',
        owner: 'КБ тракторостроения',
        stage: 'production',
        node: 'Рама и силовая структура',
        updatedAt: '22.07.2026'
    },
    {
        id: 'DOC‑TR‑TEST‑021',
        code: 'TR‑TEST‑021',
        title: 'Отчёт по стендовым испытаниям навески 3‑й категории',
        type: 'test_report',
        status: 'approved',
        owner: 'Испытательная станция',
        stage: 'production',
        node: 'Гидросистема и навеска',
        updatedAt: '21.07.2026'
    },
    {
        id: 'DOC‑RND‑FRAME‑009',
        code: 'RND‑FRAME‑009',
        title: 'Отчёт НИОКР по оптимизации силовой структуры рамы',
        type: 'rnd_report',
        status: 'approved',
        owner: 'НИОКР по конструкции',
        stage: 'finance',
        node: 'Рама и силовая структура',
        updatedAt: '20.07.2026'
    },
    {
        id: 'DOC‑PILOT‑TR‑001',
        code: 'PILOT‑TR‑001',
        title: 'Пилотное досье по внедрению модернизированной платформы',
        type: 'pilot_dossier',
        status: 'draft',
        owner: 'Проектный офис пилота',
        stage: 'finance',
        node: 'Платформа в целом',
        updatedAt: '19.07.2026'
    }
];

const packets: Packet[] = [
    {
        id: 'kb_packet',
        label: 'Пакет КБ для внутреннего согласования',
        description:
            'Набор базовых документов, необходимый для внутреннего согласования новой компоновки тракторной платформы.',
        focus: 'Структура изделия, КД и ведомости изменений.',
        docs: ['SP‑TR‑001', 'TZ‑HYD‑003', 'CL‑TR‑015'],
        readiness: 68,
        risk: 'medium'
    },
    {
        id: 'pilot_packet',
        label: 'Пакет пилота на промышленной площадке',
        description:
            'Цифровой пакет для запуска пилотного внедрения модернизированной платформы на производстве.',
        focus: 'Испытания, опытная серия, пилотные KPI.',
        docs: ['SP‑TR‑001', 'CL‑TR‑015', 'TR‑TEST‑021', 'PILOT‑TR‑001'],
        readiness: 42,
        risk: 'medium'
    },
    {
        id: 'grant_packet',
        label: 'Пакет для заявки на грант/НИОКР',
        description:
            'Комплект документов для подачи заявки на грант и финансирование НИОКР по тракторной платформе.',
        focus: 'Обоснование эффекта, отчёты НИОКР, пилот и планы масштабирования.',
        docs: ['SP‑TR‑001', 'TZ‑HYD‑003', 'RND‑FRAME‑009', 'PILOT‑TR‑001'],
        readiness: 54,
        risk: 'high'
    }
];

const flowHints: FlowHint[] = [
    {
        id: 'structure',
        title: 'Структура пакета',
        text: 'Платформа проверяет, что в пакете есть спецификация, ТЗ, ведомость изменений и отчёты по узлам.'
    },
    {
        id: 'consistency',
        title: 'Согласованность требований',
        text: 'ИИ‑инспектор ищет противоречия между ТЗ, спецификациями и ведомостями изменений по выбранным узлам.'
    },
    {
        id: 'finance',
        title: 'Контур финансирования',
        text: 'Связывает отчёты НИОКР, пилотные отчёты и планы внедрения с бюджетными строками.'
    },
    {
        id: 'grant',
        title: 'Формирование грантовой заявки',
        text: 'Отбирает необходимые документы для заявки: эффекты по НИОКР, пилот, планы тиражирования.'
    }
];

function getDocTypeLabel(type: DocType): string {
    switch (type) {
        case 'spec':
            return 'Спецификация';
        case 'tz':
            return 'ТЗ';
        case 'change_log':
            return 'Ведомость изменений';
        case 'test_report':
            return 'Отчёт испытаний';
        case 'rnd_report':
            return 'Отчёт НИОКР';
        case 'pilot_dossier':
            return 'Досье пилота';
        default:
            return 'Документ';
    }
}

function getStatusLabel(status: DocStatus): string {
    switch (status) {
        case 'draft':
            return 'Черновик';
        case 'in_review':
            return 'На согласовании';
        case 'approved':
            return 'Утверждено';
        default:
            return 'Статус';
    }
}

function getStatusClass(status: DocStatus): string {
    if (status === 'draft') return 'statusDraft';
    if (status === 'in_review') return 'statusReview';
    return 'statusApproved';
}

function getStageLabel(stage: FlowStage): string {
    switch (stage) {
        case 'kb':
            return 'КБ';
        case 'production':
            return 'Производство/испытания';
        case 'finance':
            return 'Финансы/пилот';
        case 'grant':
            return 'Грантовая заявка';
        default:
            return 'Контур';
    }
}

function getStageClass(stage: FlowStage): string {
    if (stage === 'kb') return 'stageKb';
    if (stage === 'production') return 'stageProduction';
    if (stage === 'finance') return 'stageFinance';
    return 'stageGrant';
}

function getRiskLabel(risk: Packet['risk']): string {
    if (risk === 'low') return 'Низкий';
    if (risk === 'medium') return 'Средний';
    return 'Высокий';
}

function getRiskClass(risk: Packet['risk']): string {
    if (risk === 'low') return 'riskLow';
    if (risk === 'medium') return 'riskMedium';
    return 'riskHigh';
}

export default function DocumentationPage() {
    const [activePacketId, setActivePacketId] = useState<PacketId>('kb_packet');
    const [activeDocTypeFilter, setActiveDocTypeFilter] = useState<DocType | 'all'>('all');
    const [selectedDocCode, setSelectedDocCode] = useState<string>('SP‑TR‑001');
    const [activeHintId, setActiveHintId] = useState<FlowHintId>('structure');

    const activePacket = useMemo(
        () => packets.find((p) => p.id === activePacketId) ?? packets[0],
        [activePacketId]
    );

    const docsInPacket = useMemo(
        () =>
            docItems.filter((doc) =>
                activePacket.docs.includes(doc.code)
            ),
        [activePacket]
    );

    const filteredDocs = useMemo(
        () =>
            docsInPacket.filter((doc) =>
                activeDocTypeFilter === 'all' ? true : doc.type === activeDocTypeFilter
            ),
        [docsInPacket, activeDocTypeFilter]
    );

    const selectedDoc = useMemo(
        () =>
            docItems.find((doc) => doc.code === selectedDocCode) ??
            filteredDocs[0] ??
            docsInPacket[0] ??
            null,
        [selectedDocCode, filteredDocs, docsInPacket]
    );

    const activeHint = useMemo(
        () => flowHints.find((h) => h.id === activeHintId) ?? flowHints[0],
        [activeHintId]
    );

    return (
        <div className={styles.page}>
            {/* верхний слой документации */}
            <section className={styles.hero}>
                <div className={styles.heroMain}>
                    <div className={styles.eyebrow}>
                        <span>TRACTORA AI · Документация КБ и НИОКР</span>
                    </div>
                    <h1 className={styles.title}>
                        Центр конструкторской документации и пакетов НИОКР по тракторной платформе
                    </h1>
                    <p className={styles.description}>
                        Здесь мы собираем спецификации, ТЗ, ведомости изменений, отчёты испытаний и НИОКР в
                        единые пакеты: для КБ, пилота и грантовой заявки. Платформа подсвечивает пробелы,
                        противоречия и риски по узлам.
                    </p>

                    <div className={styles.heroMetaRow}>
                        <div className={styles.heroMetaChip}>
                            <span>Активный пакет: {activePacket.label}</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Фокус: {activePacket.focus}</span>
                        </div>
                        <div className={styles.heroMetaChipMuted}>
                            <span>Готовность набора: {activePacket.readiness}%</span>
                        </div>
                    </div>

                    <div className={styles.heroActions}>
                        <button
                            type="button"
                            className={styles.primaryButton}
                            onClick={() => setActivePacketId('kb_packet')}
                        >
                            <span>Собрать пакет КБ</span>
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setActivePacketId('pilot_packet')}
                        >
                            <span>Собрать пакет пилота</span>
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => setActivePacketId('grant_packet')}
                        >
                            <span>Собрать пакет гранта/НИОКР</span>
                        </button>
                    </div>
                </div>

                <aside className={styles.heroAside}>
                    <header className={styles.heroAsideHeader}>
                        <span>Контур пакетов</span>
                        <span>Демо‑режим документации</span>
                    </header>

                    <div className={styles.packetList}>
                        {packets.map((packet) => {
                            const isActive = packet.id === activePacketId;
                            const riskClass = styles[getRiskClass(packet.risk)];
                            return (
                                <button
                                    key={packet.id}
                                    type="button"
                                    className={
                                        isActive
                                            ? `${styles.packetItem} ${styles.packetItemActive}`
                                            : styles.packetItem
                                    }
                                    onClick={() => {
                                        setActivePacketId(packet.id);
                                        setSelectedDocCode(packet.docs[0]);
                                    }}
                                >
                                    <div className={styles.packetHeader}>
                                        <span className={styles.packetLabel}>{packet.label}</span>
                                        <span className={riskClass}>Риск: {getRiskLabel(packet.risk)}</span>
                                    </div>
                                    <p className={styles.packetDescription}>{packet.description}</p>
                                    <div className={styles.packetMeta}>
                                        <span>Фокус: {packet.focus}</span>
                                        <span>Готовность: {packet.readiness}%</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <footer className={styles.heroAsideFooter}>
                        <span>Пакеты можно экспортировать в формат для промышленного заказчика</span>
                        <span>Платформа работает на демо‑данных без реальных КД</span>
                    </footer>
                </aside>
            </section>

            {/* фильтры по типам документов */}
            <section className={styles.filterRow}>
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Типы документов</span>
                    <div className={styles.filterButtons}>
                        <button
                            type="button"
                            className={
                                activeDocTypeFilter === 'all'
                                    ? `${styles.filterButton} ${styles.filterButtonActive}`
                                    : styles.filterButton
                            }
                            onClick={() => setActiveDocTypeFilter('all')}
                        >
                            <span>Все</span>
                        </button>
                        {(['spec', 'tz', 'change_log', 'test_report', 'rnd_report', 'pilot_dossier'] as DocType[]).map(
                            (type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={
                                        activeDocTypeFilter === type
                                            ? `${styles.filterButton} ${styles.filterButtonActive}`
                                            : styles.filterButton
                                    }
                                    onClick={() => setActiveDocTypeFilter(type)}
                                >
                                    <span>{getDocTypeLabel(type)}</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>Сигналы контура</span>
                    <div className={styles.filterButtons}>
                        {flowHints.map((hint) => (
                            <button
                                key={hint.id}
                                type="button"
                                className={
                                    activeHintId === hint.id
                                        ? `${styles.filterButton} ${styles.filterButtonActive}`
                                        : styles.filterButton
                                }
                                onClick={() => setActiveHintId(hint.id)}
                            >
                                <span>{hint.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* основная сетка: список документов + инспектор */}
            <section className={styles.mainGrid}>
                {/* левая колонка: список документов в пакете */}
                <div className={styles.leftColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Документы в активном пакете</span>
                                </div>
                                <h2>Реестр конструкторской документации и отчётов</h2>
                                <p>
                                    В этом реестре отображаются документы, входящие в выбранный пакет. Платформа показывает
                                    тип, статус, владельца и узел, а также подсвечивает «узкие» места по стадиям.
                                </p>
                            </div>
                        </header>

                        <div className={styles.docTable}>
                            <div className={styles.docHeaderRow}>
                                <span>Код</span>
                                <span>Название</span>
                                <span>Тип</span>
                                <span>Статус</span>
                                <span>Узел</span>
                                <span>Стадия</span>
                                <span>Обновлено</span>
                            </div>
                            <div className={styles.docBody}>
                                {filteredDocs.map((doc) => {
                                    const isActive = doc.code === selectedDocCode;
                                    const statusCls = styles[getStatusClass(doc.status)];
                                    const stageCls = styles[getStageClass(doc.stage)];
                                    const rowClass = isActive
                                        ? `${styles.docRow} ${styles.docRowActive}`
                                        : styles.docRow;
                                    return (
                                        <button
                                            key={doc.id}
                                            type="button"
                                            className={rowClass}
                                            onClick={() => setSelectedDocCode(doc.code)}
                                        >
                                            <span className={styles.docCode}>{doc.code}</span>
                                            <span className={styles.docTitle}>{doc.title}</span>
                                            <span className={styles.docType}>{getDocTypeLabel(doc.type)}</span>
                                            <span className={`${styles.docStatus} ${statusCls}`}>
                        {getStatusLabel(doc.status)}
                      </span>
                                            <span className={styles.docNode}>{doc.node}</span>
                                            <span className={`${styles.docStage} ${stageCls}`}>
                        {getStageLabel(doc.stage)}
                      </span>
                                            <span className={styles.docDate}>{doc.updatedAt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* правая колонка: инспектор документа и сигналы ИИ */}
                <div className={styles.rightColumn}>
                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Инспектор документа</span>
                                </div>
                                <h2>Интеллектуальный профиль выбранного документа</h2>
                                <p>
                                    Платформа анализирует структуру, связность и статус документа в контексте выбранного
                                    пакета: КБ, пилота или гранта. Ниже — ключевые поля и сигналы.
                                </p>
                            </div>
                        </header>

                        {selectedDoc ? (
                            <>
                                <div className={styles.inspectorGrid}>
                                    <div className={styles.inspectorItem}>
                                        <span>Код и название</span>
                                        <strong>
                                            {selectedDoc.code} · {selectedDoc.title}
                                        </strong>
                                    </div>
                                    <div className={styles.inspectorItem}>
                                        <span>Тип и статус</span>
                                        <strong>
                                            {getDocTypeLabel(selectedDoc.type)} · {getStatusLabel(selectedDoc.status)}
                                        </strong>
                                    </div>
                                    <div className={styles.inspectorItem}>
                                        <span>Узел/объект</span>
                                        <strong>{selectedDoc.node}</strong>
                                    </div>
                                    <div className={styles.inspectorItem}>
                                        <span>Владелец и стадия контура</span>
                                        <strong>
                                            {selectedDoc.owner} · {getStageLabel(selectedDoc.stage)}
                                        </strong>
                                    </div>
                                </div>

                                <div className={styles.inspectorSignals}>
                                    <div className={styles.signalItem}>
                    <span>
                      Платформа фиксирует, что документ «{selectedDoc.code}» критичен для пакета
                      «{activePacket.label}» и должен быть согласован до перехода к следующей стадии.
                    </span>
                                    </div>
                                    <div className={styles.signalItem}>
                    <span>
                      ИИ‑инспектор проверяет согласованность требований между выбранным документом и
                      связанными ТЗ, спецификациями и ведомостями изменений по узлам.
                    </span>
                                    </div>
                                    <div className={styles.signalItem}>
                    <span>
                      Для грантового пакета платформа подсвечивает необходимость добавления блока по
                      ожидаемому эффекту НИОКР и пилоту в структуру документа.
                    </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={styles.emptyInspector}>
                                <p>Документ не выбран. Нажмите на строку в реестре слева, чтобы открыть инспектор.</p>
                            </div>
                        )}

                        <div className={styles.nextActionList}>
                            <div className={styles.nextActionItem}>
                <span>
                  Обновить структуру документа по рекомендациям ИИ‑инспектора: добавить разделы по
                  эффекту, рискам и планам пилота/внедрения.
                </span>
                            </div>
                            <div className={styles.nextActionItem}>
                <span>
                  Пересобрать пакет «{activePacket.label}» при изменении статуса выбранного документа,
                  чтобы видеть актуальную готовность и риски.
                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={styles.nextActionButton}
                            onClick={() => {
                                // демо‑переключатель статуса: черновик ⇄ согласование
                                if (!selectedDoc) return;
                                const nextStatus: DocStatus =
                                    selectedDoc.status === 'draft'
                                        ? 'in_review'
                                        : selectedDoc.status === 'in_review'
                                            ? 'approved'
                                            : 'draft';
                                // В демо‑режиме просто меняем selectedDocCode и activeHint для ощущения жизни
                                setActiveHintId(
                                    nextStatus === 'approved'
                                        ? 'finance'
                                        : nextStatus === 'in_review'
                                            ? 'consistency'
                                            : 'structure'
                                );
                            }}
                        >
                            Переключить сценарий инспекции (демо‑режим)
                        </button>
                    </div>

                    <div className={styles.panelCard}>
                        <header className={styles.panelHeader}>
                            <div>
                                <div className={styles.panelEyebrow}>
                                    <span>Сигналы контура</span>
                                </div>
                                <h2>Режим подсказок ИИ по пакету</h2>
                                <p>
                                    В этом блоке платформа показывает текущий фокус: структура, согласованность,
                                    финансирование или грантовая заявка. Мы можем переключать режим и видеть подсказки по
                                    доукомплектованию пакета.
                                </p>
                            </div>
                        </header>

                        <div className={styles.hintCard}>
                            <strong className={styles.hintTitle}>{activeHint.title}</strong>
                            <p className={styles.hintText}>{activeHint.text}</p>
                            <ul className={styles.hintList}>
                                <li>
                                    Платформа анализирует весь набор документов в пакете «{activePacket.label}» и
                                    определяет, какие типы ещё отсутствуют.
                                </li>
                                <li>
                                    Связывает выбранный документ «{selectedDoc ? selectedDoc.code : '—'}» с другими
                                    документами по типу, узлу и стадиям.
                                </li>
                                <li>
                                    Формирует на основе этих связей рекомендации по доработке пакета для КБ, пилота или
                                    гранта.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}