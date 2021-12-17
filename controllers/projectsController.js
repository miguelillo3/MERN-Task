const Projects = require('../models/Projects');
const { validationResult } = require('express-validator');

//Create a new project
exports.createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Create a new project
        const project = new Projects(req.body);
        project.ownerId = req.user.id;
        project.save();
        res.json(project);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error creando el proyecto');
    }
}

//Getting the user's projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Projects.find({ ownerId: req.user.id }).sort({ createDate: 1 });
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error obteniendo los proyectos');
    }
}

//Updating a project
exports.updateProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Get the project id param
        const { id } = req.params;
        //Verify if project exists
        let project = await Projects.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }
        //Verify if user is the project's owner
        if (project.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado como Propietario del Proyecto' });
        }
        //Constructuring the new project
        const newProject = {};
        const { projname } = req.body;
        if (projname) {
            newProject.projname = projname;
        }
        //Updating project
        project = await Projects.findByIdAndUpdate({ _id: id }, { $set: newProject }, { new: true })
        res.json(project);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error actualizando proyecto');
    }
}

//Deleting a project
exports.deleteProject = async (req, res) => {
    try {
        //Getting the project id from the params
        const { id } = req.params;
        //Verifying if project exists
        let project = await Projects.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ msg: 'Proyecto no existe' });
        }
        //Verify if the user is the project's owner
        if (project.ownerId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado como Propietario del Proyecto' });
        }
        //Delete projet
        await Projects.findOneAndRemove({ _id: id });
        res.json({ msg: 'Proyecto eliminado satisfactoriamente' });
    } catch (error) {
        console.log('Hubo un error eliminando un proyecto');
        res.status(500).send('Hubo un error eliminando proyecto');
    }
}