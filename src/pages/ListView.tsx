import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronRight, FileText, LoaderCircle, RotateCw, Search } from 'lucide-react';
import { categories } from '../forms/categories';
import { CategoryKey, Lang } from '../forms/types';
import { fetchFormList, FormSummary } from '../lib/forms-api';
import { tr, UI } from '../i18n';
import { track } from '../lib/analytics';

// gusring-web ListView 그대로 (검색 + 카테고리 칩 + 서식 카드). 목록은 서버의 게시된 서식

interface Props {
  lang: Lang;
  onFormSelect: (item: FormSummary) => void;
}

export default function ListView({ lang, onFormSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'ALL'>('ALL');
  const [catalog, setCatalog] = useState<FormSummary[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    fetchFormList().then(
      (list) => alive && setCatalog(list),
      () => alive && setFailed(true),
    );
    return () => { alive = false; };
  }, [attempt]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return (catalog ?? []).filter((item) => {
      const { title } = item;
      const matchesSearch = tr(title, lang).toLowerCase().includes(q) || title.ko.includes(searchTerm);
      return matchesSearch && (selectedCategory === 'ALL' || item.category === selectedCategory);
    });
  }, [catalog, searchTerm, selectedCategory, lang]);

  // 검색어는 입력이 멈추고 300ms 뒤 한 번만 기록 (빈 검색어는 보내지 않음)
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term || !catalog) return;
    const timer = setTimeout(() => track({ type: 'search', lang, searchTerm: term, resultCount: filtered.length }), 300);
    return () => clearTimeout(timer);
    // 결과 수는 검색어가 바뀔 때의 값으로 충분하다
  }, [searchTerm]);

  const selectCategory = (cat: CategoryKey | 'ALL') => {
    setSelectedCategory(cat);
    track({ type: 'category_filter', lang, category: cat });
  };

  return (
    <div className="px-4 py-5 sm:px-5 space-y-5">
      {/* 페이지 타이틀 */}
      <div className="py-1 animate-slide-up">
        <h2 className="text-xl sm:text-2xl font-black text-gusring-text leading-tight mb-1">{tr(UI.welcome, lang)}</h2>
        <p className="text-gusring-text-sub text-[13px] font-medium">{tr(UI.subWelcome, lang)}</p>
      </div>

      {/* 검색 + 카테고리 (sticky) */}
      <div className="sticky z-20 bg-gusring-bg/90 backdrop-blur-sm pt-1 pb-4 space-y-3" style={{ top: 'var(--header-h)' }}>
        <div className="relative group animate-slide-up" style={{ animationDelay: '60ms' }}>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gusring-text-hint group-focus-within:text-gusring-yellow transition-colors" size={18} />
          <input
            type="text"
            placeholder={tr(UI.searchPlaceholder, lang)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="toss-input pl-14"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <button onClick={() => selectCategory('ALL')} className={`toss-chip ${selectedCategory === 'ALL' ? 'active' : ''}`}>
            {tr(UI.catAll, lang)}
          </button>
          {(Object.keys(categories) as CategoryKey[]).map((key) => (
            <button key={key} onClick={() => selectCategory(key)} className={`toss-chip ${selectedCategory === key ? 'active' : ''}`}>
              {tr(categories[key], lang)}
            </button>
          ))}
        </div>
      </div>

      {/* 서식 목록 */}
      <div className="grid grid-cols-1 gap-3 pb-28">
        <div className="text-[10px] text-gusring-brand-600 font-black px-1 uppercase tracking-[0.15em]">
          {selectedCategory === 'ALL' ? tr(UI.catAll, lang) : tr(categories[selectedCategory], lang)} ({filtered.length})
        </div>

        {filtered.map((item, idx) => (
          <button
            key={item.key}
            onClick={() => onFormSelect(item)}
            className="toss-card btn-press flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-4xl text-left group animate-slide-up"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className="w-12 h-12 bg-gusring-yellow-soft group-hover:bg-gusring-yellow rounded-[18px] flex items-center justify-center text-gusring-brand-600 group-hover:text-gusring-brand-950 shrink-0 transition-all duration-200 shadow-inset-sm">
              <FileText size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-gusring-brand-500 uppercase mb-1 tracking-wider">{tr(categories[item.category], lang)}</p>
              <h3 className="font-bold text-gusring-text text-[15px] leading-snug truncate">{tr(item.title, lang)}</h3>
              <p className="text-[11px] text-gusring-text-hint truncate mt-0.5 leading-relaxed font-medium group-hover:text-gusring-text-sub transition-colors">
                {tr(item.desc, lang)}
              </p>
            </div>
            <ChevronRight size={16} className="text-gusring-border-strong group-hover:text-gusring-brand-500 shrink-0 transition-colors" />
          </button>
        ))}

        {!catalog && !failed && (
          <p className="flex items-center justify-center gap-2 py-10 text-[14px] font-bold text-gusring-text-sub" aria-live="polite">
            <LoaderCircle size={18} className="animate-spin" /> {tr(UI.formLoading, lang)}
          </p>
        )}

        {failed && (
          <div role="alert" className="flex flex-col items-center py-10 text-center gap-4">
            <p className="flex items-center gap-2 text-[14px] font-bold text-gusring-text">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" /> {tr(UI.listLoadFailed, lang)}
            </p>
            <button onClick={() => setAttempt((a) => a + 1)} className="h-11 px-5 rounded-2xl bg-gusring-yellow text-gusring-brand-950 font-black text-sm inline-flex items-center gap-2 active:scale-95 transition">
              <RotateCw size={16} /> {tr(UI.retry, lang)}
            </button>
          </div>
        )}

        {catalog && filtered.length === 0 && (
          <div className="flex flex-col items-center py-10 text-center gap-2 animate-fade-in">
            <img src="/sign.png" alt="no result" className="w-36 h-auto object-contain" />
            <p className="font-black text-gusring-text text-base">{tr(UI.noResult, lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
