import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, User, FileText, CheckSquare, Clock } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, task, users, loading }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'à faire',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'à faire',
        dueDate: '',
        assignedTo: '',
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data) => {
    const taskData = {
      ...data,
      dueDate: data.dueDate || null,
      assignedTo: data.assignedTo || null,
    };
    onSubmit(taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/50 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
          <div className="relative flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <CheckSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
                </h2>
                <p className="text-blue-100">
                  {task ? 'Apportez vos modifications' : 'Créez votre prochaine mission'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              <X className="h-6 w-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Titre */}
            <div className="group">
              <label htmlFor="title" className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Titre *</span>
              </label>
              <div className="relative">
                <input
                  {...register('title', {
                    required: 'Le titre est requis',
                    maxLength: {
                      value: 100,
                      message: 'Le titre ne peut pas dépasser 100 caractères'
                    }
                  })}
                  type="text"
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-slate-800 placeholder-slate-400 font-medium group-hover:shadow-md"
                  placeholder="Donnez un titre percutant à votre tâche..."
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.title && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{errors.title.message}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="group">
              <label htmlFor="description" className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                <FileText className="h-4 w-4 text-green-500" />
                <span>Description</span>
              </label>
              <div className="relative">
                <textarea
                  {...register('description', {
                    maxLength: {
                      value: 500,
                      message: 'La description ne peut pas dépasser 500 caractères'
                    }
                  })}
                  rows={4}
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-slate-800 placeholder-slate-400 resize-none group-hover:shadow-md"
                  placeholder="Décrivez votre tâche en détail (optionnel)..."
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              {errors.description && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{errors.description.message}</p>
                </div>
              )}
            </div>

            {/* Grid pour les champs suivants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Statut */}
              <div className="group">
                <label htmlFor="status" className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                  <CheckSquare className="h-4 w-4 text-purple-500" />
                  <span>Statut</span>
                </label>
                <div className="relative">
                  <select 
                    {...register('status')} 
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-slate-800 font-medium appearance-none cursor-pointer group-hover:shadow-md"
                  >
                    <option value="à faire">⏳ À faire</option>
                    <option value="en cours">🚀 En cours</option>
                    <option value="terminée">✅ Terminée</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Date d'échéance */}
              <div className="group">
                <label htmlFor="dueDate" className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span>Date d'échéance</span>
                </label>
                <div className="relative">
                  <input
                    {...register('dueDate')}
                    type="date"
                    className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-slate-800 font-medium cursor-pointer group-hover:shadow-md"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Assigné à */}
            <div className="group">
              <label htmlFor="assignedTo" className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
                <User className="h-4 w-4 text-indigo-500" />
                <span>Assigné à</span>
              </label>
              <div className="relative">
                <select 
                  {...register('assignedTo')} 
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-slate-800 font-medium appearance-none cursor-pointer group-hover:shadow-md"
                >
                  <option value="">👤 Sélectionner un utilisateur</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      👨‍💼 {user.username}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer avec boutons */}
        <div className="px-8 py-6 bg-slate-50/50 backdrop-blur-sm border-t border-slate-200/50">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="group px-8 py-4 bg-white/70 hover:bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-300 transform backdrop-blur-sm hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Annuler</span>
            </button>
            <button
              onClick={handleSubmit(handleFormSubmit)}
              disabled={loading}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none flex items-center justify-center space-x-2 min-w-[140px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Enregistrement...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-5 w-5" />
                    <span>{task ? 'Modifier' : 'Créer'}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
