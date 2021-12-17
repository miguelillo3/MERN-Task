const Tasks = require('../models/Tasks');
const { validationResult } = require('express-validator');
const Projects = require('../models/Projects');
const { Mongoose } = require('mongoose');

//Create a new task
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Verify if task's project exists
        const { projectId } = req.body;
        const project = await Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ msg: 'No existe el proyecto' });
        }
        //Verify if task's project belong to user auth
        if (project.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado, usuario actual no es Propietario del Proyecto' });
        }
        const task = new Tasks(req.body);
        await task.save();
        res.json({ task });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Error creando la tarea' });
    }
}

//List tasks
exports.listTasks = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Verify if project exists
        const { projectId } = req.params;
        const project = await Projects.findOne({ _id: projectId });
        if (!project) {
            return res.status(404).json({ msg: 'No existe el proyecto' });
        }
        //Verify if user owns project
        if (project.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado, usuario actual no es Propietario del Proyecto' });
        }
        const tasks = await Tasks.find({ projectId });
        res.json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Error listando las tareas' });
    }

}

//Update a task
exports.updateTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Getting task id from params
        const { id } = req.params;
        //Gettind document with this id
        let task = await Tasks.findOne({ _id: id });
        if (!task) {
            return res.status(404).json({ msg: 'No existe la tarea' });
        }
        //getting project to verify if the task's project belong to auth user
        const project = await Projects.findOne({ _id: task.projectId });
        if (!project) {
            return res.status(404).json({ msg: 'El proyecto de esta tarea No existe' });
        }
        if (project.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado, usuario actual no es Propietario del Proyecto de esta tarea' });
        }
        //Constructuring the new task
        const newTask = {};
        const { taskname, statusTask } = req.body;
        if (taskname) {
            newTask.taskname = taskname;
        }
        if (statusTask !== null) {
            newTask.statusTask = statusTask;
        }

        //Updating task
        task = await Tasks.findByIdAndUpdate({ _id: id }, newTask, { new: true });
        res.json(task);

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Error actualizando tarea' });
    }
}

//Delete a task
exports.deleteTask = async (req, res) => {
    try {
        //Getting task id from params
        const { id } = req.params;
        //Gettind document with this id
        let task = await Tasks.findOne({ _id: id });
        if (!task) {
            return res.status(404).json({ msg: 'No existe la tarea' });
        }
        //getting project to verify if the task's project belong to auth user
        const project = await Projects.findOne({ _id: task.projectId });
        if (!project) {
            return res.status(404).json({ msg: 'El proyecto de esta tarea No existe' });
        }
        if (project.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado, usuario actual no es Propietario del Proyecto de esta tarea' });
        }
        console.log('Preparado para eliminar la tarea: ', task);
        //Deleting task
        await Tasks.findByIdAndDelete({ _id: id });
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: 'Error eliminando tarea' });
    }
}