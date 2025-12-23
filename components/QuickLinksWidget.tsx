import React, { useState } from 'react';
import { ExternalLink, Plus, X, Edit2 } from 'lucide-react';

interface QuickLink {
    name: string;
    url: string;
    icon?: string;
}

const DEFAULT_LINKS: QuickLink[] = [
    { name: 'Figma', url: 'https://figma.com', icon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128' },
    { name: 'Calendar', url: 'https://calendar.google.com', icon: 'https://www.google.com/s2/favicons?domain=calendar.google.com&sz=128' },
    { name: 'Meet', url: 'https://meet.google.com', icon: 'https://www.google.com/s2/favicons?domain=meet.google.com&sz=128' },
    { name: 'AI Studio', url: 'https://aistudio.google.com', icon: 'https://www.google.com/s2/favicons?domain=aistudio.google.com&sz=128' },
    { name: 'Docs', url: 'https://docs.google.com', icon: 'https://www.google.com/s2/favicons?domain=docs.google.com&sz=128' },
];

export const QuickLinksWidget: React.FC = () => {
    const [links, setLinks] = useState<QuickLink[]>(() => {
        const saved = localStorage.getItem('quick_links');
        return saved ? JSON.parse(saved) : DEFAULT_LINKS;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: '', url: '', icon: '' });

    const saveLinks = (newLinks: QuickLink[]) => {
        setLinks(newLinks);
        localStorage.setItem('quick_links', JSON.stringify(newLinks));
    };

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch {
            return '';
        }
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditForm(links[index]);
    };

    const handleSave = () => {
        if (editingIndex !== null && editForm.name && editForm.url) {
            const newLinks = [...links];
            newLinks[editingIndex] = {
                ...editForm,
                icon: editForm.icon || getFaviconUrl(editForm.url),
            };
            saveLinks(newLinks);
            setEditingIndex(null);
            setEditForm({ name: '', url: '', icon: '' });
        }
    };

    const handleAdd = () => {
        if (editForm.name && editForm.url && links.length < 10) {
            saveLinks([...links, {
                ...editForm,
                icon: editForm.icon || getFaviconUrl(editForm.url),
            }]);
            setEditForm({ name: '', url: '', icon: '' });
        }
    };

    const handleDelete = (index: number) => {
        saveLinks(links.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Quick Access</span>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white/40 hover:text-white transition-colors"
                    title={isEditing ? 'Done' : 'Edit Links'}
                >
                    {isEditing ? <X size={14} /> : <Edit2 size={14} />}
                </button>
            </div>

            {/* Links Grid */}
            {!isEditing ? (
                <div className="grid grid-cols-5 gap-2 flex-1">
                    {links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all hover:scale-105 aspect-square"
                        >
                            {link.icon && link.icon.startsWith('http') ? (
                                <img
                                    src={link.icon}
                                    alt={link.name}
                                    className="w-8 h-8 mb-1 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.nextElementSibling!.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <span className={`text-2xl mb-1 ${link.icon?.startsWith('http') ? 'hidden' : ''}`}>
                                {link.icon && !link.icon.startsWith('http') ? link.icon : '🔗'}
                            </span>
                            <span className="text-[9px] text-white/70 group-hover:text-white font-medium text-center line-clamp-2 leading-tight">
                                {link.name}
                            </span>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                    {/* Edit existing links */}
                    {links.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10">
                            {editingIndex === idx ? (
                                <>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="Name"
                                        className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                                    />
                                    <input
                                        type="url"
                                        value={editForm.url}
                                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                        placeholder="https://..."
                                        className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                                    />
                                    <button onClick={handleSave} className="text-emerald-400 hover:text-emerald-300 p-1">
                                        ✓
                                    </button>
                                    <button onClick={() => setEditingIndex(null)} className="text-white/40 hover:text-white p-1">
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <>
                                    {link.icon?.startsWith('http') ? (
                                        <img src={link.icon} alt="" className="w-5 h-5 object-contain" />
                                    ) : (
                                        <span className="text-sm">{link.icon || '🔗'}</span>
                                    )}
                                    <span className="flex-1 text-xs text-white/80 truncate">{link.name}</span>
                                    <button onClick={() => handleEdit(idx)} className="text-white/40 hover:text-white p-1">
                                        <Edit2 size={12} />
                                    </button>
                                    <button onClick={() => handleDelete(idx)} className="text-white/40 hover:text-red-400 p-1">
                                        <X size={12} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Add new link */}
                    {links.length < 10 && editingIndex === null && (
                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10 border-dashed">
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                placeholder="Name"
                                className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                            />
                            <input
                                type="url"
                                value={editForm.url}
                                onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                                placeholder="https://..."
                                className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white"
                            />
                            <button onClick={handleAdd} className="text-emerald-400 hover:text-emerald-300 p-1" title="Add Link">
                                <Plus size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
