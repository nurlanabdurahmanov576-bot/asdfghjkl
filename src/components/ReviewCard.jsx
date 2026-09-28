import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

export default function ReviewCard({ review }) {
  const [likes, setLikes] = useState(review.likes || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(prev => prev - 1);
      setLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setLiked(true);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-soft transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Header: Author & Rating */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <img
              src={review.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={review.author}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <h4 className="font-bold text-sm text-slate-900 leading-tight">
                {review.author}
              </h4>
              <span className="text-xs text-slate-400">{review.date}</span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= review.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {review.comment}
        </p>
      </div>

      {/* Footer / Likes */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            liked
              ? 'bg-brand-50 text-brand-700 font-bold'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
          <span>Полезно ({likes})</span>
        </button>
      </div>
    </div>
  );
}
