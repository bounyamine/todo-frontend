import { Calendar, User, Edit, Trash2, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TaskCard = ({ task, onEdit, onDelete, onComplete, users }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'à faire':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          text: 'text-white',
          bgLight: 'bg-red-50',
          border: 'border-red-200',
          emoji: '⏳'
        };
      case 'en cours':
        return {
          bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          text: 'text-white',
          bgLight: 'bg-yellow-50',
          border: 'border-yellow-200',
          emoji: '🚀'
        };
      case 'terminée':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          text: 'text-white',
          bgLight: 'bg-green-50',
          border: 'border-green-200',
          emoji: '✅'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-slate-500',
          text: 'text-white',
          bgLight: 'bg-gray-50',
          border: 'border-gray-200',
          emoji: '📝'
        };
    }
  };

  const getAssignedUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.username : 'Non assigné';
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
      </div>
      
      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-800 line-clamp-2 pr-4 group-hover:text-blue-600 transition-colors duration-300">
            {task.title}
          </h3>
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-3 py-2 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
              <span className="mr-1">{statusConfig.emoji}</span>
              {task.status}
            </span>
          </div>
        </div>
        
        {/* Description */}
        {task.description && (
          <div className={`p-4 ${statusConfig.bgLight} ${statusConfig.border} border rounded-2xl mb-4`}>
            <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}
        
        {/* Meta Information */}
        <div className="space-y-3 mb-6">
          {task.dueDate && (
            <div className="flex items-center text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Échéance</p>
                <p className="text-slate-500">
                  {format(new Date(task.dueDate), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          )}
          
          {task.assignedTo && (
            <div className="flex items-center text-sm text-slate-500 bg-slate-50 rounded-xl p-3">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-slate-700">Assigné à</p>
                <p className="text-slate-500">{getAssignedUserName(task.assignedTo)}</p>
              </div>
            </div>
          )}
          
          {task.completedAt && (
            <div className="flex items-center text-sm text-green-600 bg-green-50 rounded-xl p-3">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-700">Terminé le</p>
                <p className="text-green-600">
                  {format(new Date(task.completedAt), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400 font-medium">
            Créé le {format(new Date(task.createdAt), 'dd/MM/yyyy', { locale: fr })}
          </div>
          
          <div className="flex space-x-2">
            {task.status !== 'terminée' && (
              <button
                onClick={() => onComplete(task._id)}
                className="group/btn p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-300 hover:scale-110 transform"
                title="Marquer comme terminé"
              >
                <CheckCircle className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
              </button>
            )}
            
            <button
              onClick={() => onEdit(task)}
              className="group/btn p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110 transform"
              title="Modifier"
            >
              <Edit className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => onDelete(task._id)}
              className="group/btn p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 transform"
              title="Supprimer"
            >
              <Trash2 className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;