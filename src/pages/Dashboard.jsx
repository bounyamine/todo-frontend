import { useState, useEffect } from 'react';
import { Plus, Filter, Search, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { taskAPI, authAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
    search: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data.tasks || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des tâches');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterTasks = () => {
    let filtered = [...tasks];

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.assignedTo) {
      filtered = filtered.filter(task => task.assignedTo === filters.assignedTo);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (taskData) => {
    setModalLoading(true);
    try {
      const response = await taskAPI.createTask(taskData);
      setTasks([response.data.task, ...tasks]);
      setIsModalOpen(false);
      toast.success('Tâche créée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création de la tâche');
      console.error('Error creating task:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    setModalLoading(true);
    try {
      const response = await taskAPI.updateTask(editingTask._id, taskData);
      setTasks(tasks.map(task =>
        task._id === editingTask._id ? response.data.task : task
      ));
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Tâche modifiée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la modification de la tâche');
      console.error('Error updating task:', error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Tâche supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression de la tâche');
      console.error('Error deleting task:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await taskAPI.completeTask(taskId);
      setTasks(tasks.map(task =>
        task._id === taskId ? response.data.task : task
      ));
      toast.success('Tâche marquée comme terminée');
    } catch (error) {
      toast.error('Erreur lors de la completion de la tâche');
      console.error('Error completing task:', error);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const resetFilters = () => {
    setFilters({ status: '', assignedTo: '', search: '' });
  };

  const getTaskStats = () => {
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'à faire').length,
      inProgress: tasks.filter(t => t.status === 'en cours').length,
      completed: tasks.filter(t => t.status === 'terminée').length,
    };
    return stats;
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-solid rounded-full animate-spin border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Tableau de bord
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Organisez votre productivité avec style et efficacité
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 ">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Total</p>
              <p className="text-4xl font-bold text-slate-800 mb-2">{stats.total}</p>
              <div className="w-full bg-blue-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 ">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">À faire</p>
              <p className="text-4xl font-bold text-slate-800 mb-2">{stats.todo}</p>
              <div className="w-full bg-red-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full" style={{width: `${stats.total ? (stats.todo / stats.total) * 100 : 0}%`}}></div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 ">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">En cours</p>
              <p className="text-4xl font-bold text-slate-800 mb-2">{stats.inProgress}</p>
              <div className="w-full bg-yellow-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: `${stats.total ? (stats.inProgress / stats.total) * 100 : 0}%`}}></div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 ">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Terminées</p>
              <p className="text-4xl font-bold text-slate-800 mb-2">{stats.completed}</p>
              <div className="w-full bg-green-100 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
                Mes tâches
              </h2>
              <p className="text-slate-600">Gérez et organisez vos projets en cours</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                <Plus className="h-6 w-6" />
                <span>Nouvelle tâche</span>
              </div>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">Tous les statuts</option>
              <option value="à faire">À faire</option>
              <option value="en cours">En cours</option>
              <option value="terminée">Terminée</option>
            </select>
            
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="px-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
            >
              <option value="">Tous les utilisateurs</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            
            <button
              onClick={resetFilters}
              className="group px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-2xl transition-all duration-300 transform flex items-center justify-center space-x-2"
            >
              <Filter className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
              <span>Réinitialiser</span>
            </button>
          </div>

          {/* Tasks Grid */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <Plus className="h-16 w-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-3">
                {tasks.length === 0 ? 'Aucune tâche créée' : 'Aucune tâche correspondante'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {tasks.length === 0 
                  ? 'Commencez votre aventure productive en créant votre première tâche'
                  : 'Aucune tâche ne correspond à vos critères de recherche actuels'
                }
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
                >
                  Créer ma première tâche
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  users={users}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onComplete={handleCompleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        task={editingTask}
        users={users}
        loading={modalLoading}
      />
    </div>
  );
};

export default Dashboard;