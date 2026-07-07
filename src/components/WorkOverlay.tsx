import React, { useState } from 'react';
import { Work } from '../types';
import { useComments } from '../context/CommentContext';
import { X, Navigation, Youtube, MapPin, Loader2, ImagePlus, Phone, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Props {
  work: Work;
  onClose: () => void;
  userCoords: [number, number] | null;
  routingLoading: boolean;
  onRouteRequest: () => void;
  commentsOnly?: boolean;
}

export default function WorkOverlay({ work, onClose, userCoords, routingLoading, onRouteRequest, commentsOnly = false }: Props) {
  const { comments, addComment, getCommentsByWork } = useComments();
  const workComments = getCommentsByWork(work.name);
  
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() && selectedPhotos.length === 0) return;

    addComment({
      workName: work.name,
      userId: 'anonymous_' + Date.now(),
      userInitials: 'A',
      text: newComment,
      photos: selectedPhotos
    });

    setNewComment('');
    setSelectedPhotos([]);
  };

  return (
    <>
      <div className="w-full h-full max-h-[90vh] md:max-h-[85vh] max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-8 relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button Floating Outside */}
        <button 
          onClick={onClose} 
          className="absolute -top-10 right-0 md:-top-12 md:-right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-[2000]"
        >
          <X className="w-6 h-6" />
        </button>

        {/* SOL PANEL (Detaylar) */}
        {!commentsOnly && (
          <div className="bg-white dark:bg-stone-900 w-full md:w-1/2 flex flex-col overflow-hidden rounded-xl shadow-2xl border border-gray-200 dark:border-stone-700">
            <div className="sticky top-0 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-gray-200 dark:border-stone-700 p-6 flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B7410E] dark:text-[#D4A017]">{work.type}</span>
              <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-white leading-tight mt-1">{work.name}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-stone-800 rounded-full hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-500 transition-colors md:hidden">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-stone-300">
              <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[#991B1B]" />
              <p className="leading-relaxed">{work.address !== 'Bilgi Yok' && work.address !== 'Yok' ? work.address : ''} {work.district}</p>
            </div>

            {work.phone && work.phone !== 'Bilgi Yok' && work.phone !== 'Yok' && (
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-stone-300">
                <Phone className="w-5 h-5 shrink-0 text-[#991B1B]" />
                <p>{work.phone}</p>
              </div>
            )}

            {work.hours && work.hours !== 'Bilgi Yok' && work.hours !== 'Yok' && (
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-stone-300">
                <Clock className="w-5 h-5 shrink-0 text-[#991B1B]" />
                <p>{work.hours}</p>
              </div>
            )}

            <div className="p-5 bg-[#F9F8F6] dark:bg-stone-950 rounded-lg border border-gray-200 dark:border-stone-800 text-sm leading-relaxed text-gray-700 dark:text-stone-300">
               {work.year && <p className="font-bold mb-2 text-xs uppercase tracking-widest text-gray-400">Yapım Yılı: {work.year}</p>}
               Bu eser Mimar Sinan'ın {work.district} bölgesindeki önemli {work.type.toLowerCase()} yapılarından biridir.
            </div>

            {/* Youtube Video Embed (if available) or generic placeholder */}
            {work.youtube && work.youtube !== 'İzle' && work.youtube !== 'Yok' ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative shadow-sm">
                <iframe 
                  src={work.youtube.replace('watch?v=', 'embed/').split('&')[0]} 
                  title={`${work.name} Video`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
               <div className="aspect-video w-full rounded-lg bg-gray-50 dark:bg-stone-800/50 flex items-center justify-center border border-gray-200 dark:border-stone-700">
                 <div className="text-center text-gray-400">
                   <Youtube className="w-10 h-10 mx-auto mb-3 opacity-50" />
                   <p className="text-xs uppercase font-bold tracking-widest">Video Bulunmuyor</p>
                 </div>
               </div>
            )}

            <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-stone-700">
               <button 
                 onClick={onRouteRequest}
                 disabled={routingLoading}
                 className="w-full flex items-center justify-center gap-2 bg-[#991B1B] hover:bg-[#7f1616] text-white py-4 px-4 rounded-lg font-bold uppercase text-xs tracking-widest transition-colors shadow-sm disabled:opacity-70"
               >
                 {routingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                 Yol Tarifi Başlat
               </button>
               
               {!showComments && (
                 <button 
                   onClick={() => setShowComments(true)}
                   className="w-full py-4 px-4 bg-white dark:bg-stone-800 border border-gray-300 dark:border-stone-600 text-[#1A1A1A] dark:text-stone-200 font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors shadow-sm md:hidden"
                 >
                   Yorumları Gör ({workComments.length})
                 </button>
               )}
            </div>
          </div>
        </div>
        )}

        {/* SAĞ PANEL (Yorumlar) */}
        <div className={`bg-[#F9F8F6] dark:bg-stone-950 w-full ${commentsOnly ? 'md:max-w-2xl mx-auto' : 'md:w-1/2'} flex flex-col rounded-xl shadow-2xl border border-gray-200 dark:border-stone-700 overflow-hidden ${(!commentsOnly && !showComments) ? 'hidden md:flex' : 'flex'}`}>
           <div className="sticky top-0 bg-[#F9F8F6]/90 dark:bg-stone-950/90 backdrop-blur border-b border-gray-200 dark:border-stone-700 p-6 flex justify-between items-center z-10">
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A] dark:text-white">Topluluk Yorumları <span className="text-sm font-normal text-gray-500 ml-2">- {work.name}</span></h3>
              {!commentsOnly && (
                <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-gray-600 md:hidden">
                  <X className="w-5 h-5" />
                </button>
              )}
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-4">
             {workComments.length === 0 ? (
               <div className="text-center py-12 opacity-50 bg-white/50 dark:bg-stone-900/50 rounded-lg border border-dashed border-gray-300 dark:border-stone-700">
                 <p className="text-sm dark:text-stone-300">Henüz yorum yapılmamış.</p>
                 <p className="text-xs mt-2 dark:text-stone-400 font-medium">İlk yorumu siz yapın!</p>
               </div>
             ) : (
               workComments.map(c => (
                 <div key={c.id} className="bg-white dark:bg-stone-900 p-5 rounded-lg border border-gray-200 dark:border-stone-800 shadow-sm">
                   <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-[#1A1A1A] dark:bg-stone-700 text-white flex items-center justify-center text-xs font-bold font-serif">
                         {c.userInitials}
                       </div>
                       <span className="text-sm font-bold text-gray-700 dark:text-stone-300">{c.userInitials}</span>
                     </div>
                     <span className="text-[10px] uppercase tracking-wider text-gray-400">{formatDistanceToNow(new Date(c.date), { addSuffix: true, locale: tr })}</span>
                   </div>
                   <p className="text-sm text-gray-800 dark:text-stone-200 leading-relaxed mb-4">{c.text}</p>
                   
                   {c.photos && c.photos.length > 0 && (
                     <div className="flex gap-2 overflow-x-auto pb-2">
                       {c.photos.map((photo, i) => (
                         <img 
                           key={i} 
                           src={photo} 
                           alt="User upload" 
                           className="h-20 w-20 object-cover rounded-md cursor-zoom-in border border-gray-200 dark:border-stone-700 shrink-0"
                           onClick={() => setZoomedPhoto(photo)}
                         />
                       ))}
                     </div>
                   )}
                 </div>
               ))
             )}
           </div>

           <div className="p-5 bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-700 mt-auto shrink-0">
               <div className="space-y-4">
                 <textarea 
                   value={newComment}
                   onChange={e => setNewComment(e.target.value)}
                   placeholder="Deneyiminizi paylaşın..."
                   className="w-full text-sm p-4 bg-[#F9F8F6] dark:bg-stone-950 border border-gray-200 dark:border-stone-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#991B1B]/50 resize-none h-24 dark:text-stone-200 placeholder:text-gray-400 transition-shadow"
                 />
                 
                 {selectedPhotos.length > 0 && (
                   <div className="flex gap-3 overflow-x-auto">
                     {selectedPhotos.map((photo, idx) => (
                       <div key={idx} className="relative inline-block shrink-0">
                         <img src={photo} className="h-16 w-16 object-cover rounded-md border border-gray-200 shadow-sm" />
                         <button onClick={() => setSelectedPhotos(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
                 
                 <div className="flex gap-3 justify-between items-center">
                   <label className="cursor-pointer p-3 bg-gray-50 dark:bg-stone-800 text-gray-600 dark:text-stone-300 rounded-lg border border-gray-200 dark:border-stone-700 hover:bg-gray-100 dark:hover:bg-stone-700 transition-colors shadow-sm">
                     <ImagePlus className="w-5 h-5" />
                     <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                   </label>
                   <button 
                     onClick={handleAddComment}
                     disabled={!newComment.trim() && selectedPhotos.length === 0}
                     className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#333] tracking-widest disabled:opacity-50 disabled:hover:bg-[#1A1A1A] text-white text-xs font-bold uppercase rounded-lg transition-colors shadow-sm"
                   >
                     Gönder
                   </button>
                 </div>
               </div>
           </div>
        </div>
      </div>

      {/* Photo Zoom Modal */}
      {zoomedPhoto && (
        <div className="fixed inset-0 z-[3000] bg-black/90 flex items-center justify-center p-4">
          <button onClick={() => setZoomedPhoto(null)} className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X className="w-8 h-8" />
          </button>
          <img src={zoomedPhoto} className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </>
  );
}
