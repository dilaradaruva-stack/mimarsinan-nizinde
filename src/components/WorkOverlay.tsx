import { useState, useEffect } from 'react';
import { Work } from '../types';
import { useAuth } from '../context/AuthContext';
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
}

export default function WorkOverlay({ work, onClose, userCoords, routingLoading, onRouteRequest }: Props) {
  const { user, setShowAuthModal } = useAuth();
  const { comments, addComment, getCommentsByWork } = useComments();
  const workComments = getCommentsByWork(work.name);
  
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  useEffect(() => {
    // When work opens, check if unauthenticated to show modal
    if (!user) {
      setShowAuthModal(true);
    }
  }, [user, setShowAuthModal, work]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddComment = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!newComment.trim() && selectedPhotos.length === 0) return;

    addComment({
      workName: work.name,
      userId: user.id,
      userInitials: user.initials,
      text: newComment,
      photos: selectedPhotos
    });

    setNewComment('');
    setSelectedPhotos([]);
  };

  return (
    <>
      <div className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-4 md:left-1/2 md:-translate-x-1/2 z-[1000] w-full md:w-auto md:max-w-5xl flex flex-col md:flex-row shadow-2xl transition-all duration-300 transform translate-y-0 max-h-[85vh] md:max-h-[80vh]">
        
        {/* SOL PANEL (Detaylar) */}
        <div className="bg-white dark:bg-stone-900 w-full md:w-[400px] flex flex-col overflow-y-auto rounded-t-xl md:rounded-l-xl md:rounded-tr-none border border-gray-200 dark:border-stone-700 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95">
          <div className="sticky top-0 bg-white/90 dark:bg-stone-900/90 backdrop-blur border-b border-gray-200 dark:border-stone-700 p-4 flex justify-between items-start z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B7410E] dark:text-[#D4A017]">{work.type}</span>
              <h2 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-white leading-tight mt-1">{work.name}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-stone-800 rounded-full hover:bg-gray-200 dark:hover:bg-stone-700 text-gray-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 space-y-6 flex-1">
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-stone-300">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#991B1B]" />
              <p>{work.address !== 'Bilgi Yok' && work.address !== 'Yok' ? work.address : ''} {work.district}</p>
            </div>

            {work.phone && work.phone !== 'Bilgi Yok' && work.phone !== 'Yok' && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-stone-300">
                <Phone className="w-4 h-4 shrink-0 text-[#991B1B]" />
                <p>{work.phone}</p>
              </div>
            )}

            {work.hours && work.hours !== 'Bilgi Yok' && work.hours !== 'Yok' && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-stone-300">
                <Clock className="w-4 h-4 shrink-0 text-[#991B1B]" />
                <p>{work.hours}</p>
              </div>
            )}

            <div className="p-4 bg-[#F9F8F6] dark:bg-stone-950 rounded-sm border border-gray-200 dark:border-stone-800 text-sm leading-relaxed text-gray-700 dark:text-stone-300">
               {work.year && <p className="font-bold mb-2 text-xs uppercase tracking-widest text-gray-400">Yapım Yılı: {work.year}</p>}
               Bu eser Mimar Sinan'ın {work.district} bölgesindeki önemli {work.type.toLowerCase()} yapılarından biridir.
            </div>

            {/* Youtube Video Embed (if available) or generic placeholder */}
            {work.youtube && work.youtube !== 'İzle' && work.youtube !== 'Yok' ? (
              <div className="aspect-video w-full rounded-sm overflow-hidden bg-black relative">
                <iframe 
                  src={work.youtube.replace('watch?v=', 'embed/').split('&')[0]} 
                  title={`${work.name} Video`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
               <div className="aspect-video w-full rounded-sm bg-gray-100 dark:bg-stone-800 flex items-center justify-center border border-gray-200 dark:border-stone-700">
                 <div className="text-center text-gray-400">
                   <Youtube className="w-8 h-8 mx-auto mb-2 opacity-50" />
                   <p className="text-xs uppercase font-bold tracking-widest">Video Bulunmuyor</p>
                 </div>
               </div>
            )}

            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-stone-700">
               <button 
                 onClick={onRouteRequest}
                 disabled={routingLoading}
                 className="w-full flex items-center justify-center gap-2 bg-[#991B1B] hover:bg-[#7f1616] text-white py-3 px-4 rounded-sm font-bold uppercase text-xs tracking-widest transition-colors shadow-sm disabled:opacity-70"
               >
                 {routingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                 Yol Tarifi Başlat
               </button>
               
               {!showComments && (
                 <button 
                   onClick={() => setShowComments(true)}
                   className="w-full py-3 px-4 bg-white dark:bg-stone-800 border border-gray-300 dark:border-stone-600 text-[#1A1A1A] dark:text-stone-200 font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors shadow-sm md:hidden"
                 >
                   Yorumları Gör ({workComments.length})
                 </button>
               )}
            </div>
          </div>
        </div>

        {/* SAĞ PANEL (Yorumlar) */}
        <div className={`bg-[#F9F8F6] dark:bg-stone-950 w-full md:w-[450px] flex flex-col border-t md:border-t-0 md:border-l border-gray-200 dark:border-stone-700 rounded-b-xl md:rounded-r-xl transition-all ${showComments ? 'block' : 'hidden md:flex'}`}>
           <div className="sticky top-0 bg-[#F9F8F6]/90 dark:bg-stone-950/90 backdrop-blur border-b border-gray-200 dark:border-stone-700 p-4 flex justify-between items-center z-10">
              <h3 className="font-serif font-bold text-lg text-[#1A1A1A] dark:text-white">Topluluk Yorumları</h3>
              <button onClick={() => setShowComments(false)} className="text-gray-400 hover:text-gray-600 md:hidden">Kapat</button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {workComments.length === 0 ? (
               <div className="text-center py-10 opacity-50">
                 <p className="text-sm dark:text-stone-300">Henüz yorum yapılmamış.</p>
                 <p className="text-xs mt-1 dark:text-stone-400">İlk yorumu siz yapın!</p>
               </div>
             ) : (
               workComments.map(c => (
                 <div key={c.id} className="bg-white dark:bg-stone-900 p-4 rounded-sm border border-gray-200 dark:border-stone-800 shadow-sm">
                   <div className="flex justify-between items-center mb-3">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-[#1A1A1A] dark:bg-stone-700 text-white flex items-center justify-center text-xs font-bold font-serif">
                         {c.userInitials}
                       </div>
                       <span className="text-xs font-bold text-gray-700 dark:text-stone-300">{c.userInitials}</span>
                     </div>
                     <span className="text-[10px] text-gray-400">{formatDistanceToNow(new Date(c.date), { addSuffix: true, locale: tr })}</span>
                   </div>
                   <p className="text-sm text-gray-800 dark:text-stone-200 leading-relaxed mb-3">{c.text}</p>
                   
                   {c.photos && c.photos.length > 0 && (
                     <div className="flex gap-2 overflow-x-auto pb-2">
                       {c.photos.map((photo, i) => (
                         <img 
                           key={i} 
                           src={photo} 
                           alt="User upload" 
                           className="h-16 w-16 object-cover rounded-sm cursor-zoom-in border border-gray-200 dark:border-stone-700 shrink-0"
                           onClick={() => setZoomedPhoto(photo)}
                         />
                       ))}
                     </div>
                   )}
                 </div>
               ))
             )}
           </div>

           <div className="p-4 bg-white dark:bg-stone-900 border-t border-gray-200 dark:border-stone-700 mt-auto shrink-0">
              {!user ? (
                 <button 
                   onClick={() => setShowAuthModal(true)}
                   className="w-full py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest rounded-sm"
                 >
                   Yorum Yapmak İçin Giriş Yap
                 </button>
              ) : (
                 <div className="space-y-3">
                   <textarea 
                     value={newComment}
                     onChange={e => setNewComment(e.target.value)}
                     placeholder="Deneyiminizi paylaşın..."
                     className="w-full text-sm p-3 bg-[#F9F8F6] dark:bg-stone-950 border border-gray-200 dark:border-stone-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#991B1B] resize-none h-20 dark:text-stone-200 placeholder:text-gray-400"
                   />
                   
                   {selectedPhotos.length > 0 && (
                     <div className="flex gap-2 overflow-x-auto">
                       {selectedPhotos.map((photo, idx) => (
                         <div key={idx} className="relative inline-block shrink-0">
                           <img src={photo} className="h-12 w-12 object-cover rounded-sm border border-gray-200" />
                           <button onClick={() => setSelectedPhotos(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                   
                   <div className="flex gap-2 justify-between items-center">
                     <label className="cursor-pointer p-2 bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 rounded-sm hover:bg-gray-200 dark:hover:bg-stone-700 transition">
                       <ImagePlus className="w-4 h-4" />
                       <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                     </label>
                     <button 
                       onClick={handleAddComment}
                       disabled={!newComment.trim() && selectedPhotos.length === 0}
                       className="flex-1 py-2.5 bg-[#1A1A1A] hover:bg-[#333] tracking-widest disabled:opacity-50 text-white text-xs font-bold uppercase rounded-sm transition"
                     >
                       Gönder
                     </button>
                   </div>
                 </div>
              )}
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
