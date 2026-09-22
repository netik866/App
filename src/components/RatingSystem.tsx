import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  Plus, 
  Award, 
  CheckCircle2, 
  Building2,
  Tag
} from 'lucide-react';
import { DailyHelp, Review, AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface RatingSystemProps {
  currentLang: AppLanguage;
  dailyHelps: DailyHelp[];
  reviews: Review[];
  onAddReview: (newReview: Omit<Review, 'id' | 'date'>) => void;
  onViewProfile: (help: DailyHelp) => void;
}

const AVAILABLE_TAGS = [
  'Always On Time',
  'Very Thorough',
  'Keyholder Trust',
  'Hygienic & Clean',
  'Great Cook',
  'Patient with Kids',
  'Elderly Care Expert',
  'Smooth Driving',
  'Polite & Respectful',
  'Rarely Takes Leave'
];

export const RatingSystem: React.FC<RatingSystemProps> = ({
  currentLang,
  dailyHelps,
  reviews,
  onAddReview,
  onViewProfile,
}) => {
  const t = translations[currentLang];
  const [selectedFilterHelp, setSelectedFilterHelp] = useState<string>('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // New review form
  const [targetHelpId, setTargetHelpId] = useState(dailyHelps[0]?.id || '');
  const [residentName, setResidentName] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Always On Time', 'Very Thorough']);
  const [commentText, setCommentText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    return selectedFilterHelp === 'all' || r.helpId === selectedFilterHelp;
  });

  const overallAvgRating = (
    dailyHelps.reduce((acc, h) => acc + h.rating, 0) / (dailyHelps.length || 1)
  ).toFixed(2);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetHelpId || !residentName.trim() || !flatNumber.trim() || !commentText.trim()) {
      return;
    }

    onAddReview({
      helpId: targetHelpId,
      residentName: residentName.trim(),
      flatNumber: flatNumber.trim().toUpperCase(),
      rating: ratingScore,
      tags: selectedTags,
      comment: commentText.trim(),
    });

    setIsReviewModalOpen(false);
    setResidentName('');
    setFlatNumber('');
    setCommentText('');
    setRatingScore(5);
  };

  return (
    <div className="space-y-5">
      {/* Header & Score Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {t.ratingsTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.ratingsSubtitle}
            </p>
          </div>

          <button
            type="button"
            id="btn-open-add-review"
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t.rateDailyHelpBtn}
          </button>
        </div>

        {/* Rating Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-500">{t.averageRating}</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900">{overallAvgRating}</span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-0.5 mt-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-500">{t.totalReviews}</p>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{reviews.length + 90}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Resident Verified
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-500">Punctuality Score</p>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">98.4%</p>
            <p className="text-[11px] text-slate-500 mt-1">Logged by Gate Terminal</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-500">Top Rated Category</p>
            <p className="text-sm font-bold text-slate-900 mt-1">Childcare & Cooking</p>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">4.95 Avg Score</p>
          </div>
        </div>
      </div>

      {/* Filter by Daily Help */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-3.5 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-700">Filter Feedback by Staff:</span>
        <select
          id="select-review-filter-help"
          value={selectedFilterHelp}
          onChange={(e) => setSelectedFilterHelp(e.target.value)}
          className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
        >
          <option value="all">All Staff Members ({reviews.length} reviews)</option>
          {dailyHelps.map((h) => (
            <option key={h.id} value={h.id}>
              {h.fullName} ({h.id}) - {h.rating} ★
            </option>
          ))}
        </select>
      </div>

      {/* Review List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => {
          const help = dailyHelps.find((h) => h.id === rev.helpId);

          return (
            <div
              key={rev.id}
              id={`review-card-${rev.id}`}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Help & Resident info */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={help?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={help?.fullName || 'Staff'}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p 
                        onClick={() => help && onViewProfile(help)}
                        className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
                      >
                        {help?.fullName || 'Daily Help'}
                      </p>
                      <p className="text-[11px] text-slate-500">{help?.id} • {help?.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-0.5 justify-end text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-slate-700 mt-3 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Skill & Trust Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {rev.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      <Tag className="w-2.5 h-2.5 text-amber-600" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attribution */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800">
                  {rev.residentName}
                </span>
                <span className="flex items-center gap-1 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  <Building2 className="w-3 h-3 text-slate-500" />
                  Flat {rev.flatNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.rateDailyHelpBtn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Daily Help to Rate:
                </label>
                <select
                  value={targetHelpId}
                  onChange={(e) => setTargetHelpId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                >
                  {dailyHelps.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.fullName} ({h.id}) - {h.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Resident Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Sharma"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Flat Number:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-402"
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm uppercase font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Star Rating selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Overall Star Rating:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingScore
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-slate-700 ml-2">
                    {ratingScore} out of 5 Stars
                  </span>
                </div>
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Commendation Tags:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Feedback / Experience:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details regarding punctuality, cleanliness, cooking taste, trustworthiness..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
