const Service = require("../models/service");
const Homestay = require("../models/homestay");

class ServiceController {
  //GET /services/new
  create(req, res, next) {
    res.send("create service");
  }

  //POST /services
  async postCreate(req, res, next) {
    try {
      const service = new Service({
        ...req.body,
      });
      service.save();
      res.send(service);
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async delete(req, res, next) {
    try {
      const service = await Service.findByIdAndDelete({ _id: req.params.id });
      res.send("delete successfully");
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async getService(req, res, next) {
    try {
      const service = await Service.findById(req.params.id);
      res.status(200).send({ service });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async getServicesByHomestay(req, res, next) {
    try {
      const services = await Service.find({ homestay: req.params.homestayId });
      res.status(200).send({ services });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async update(req, res, next) {
    const updates = Object.keys(req.body);
    console.log("oke");
    const service = await Service.findById(req.params.id);
    try {
      updates.forEach((update) => (service[update] = req.body[update]));
      await service.save();
      res.send({ service });
    } catch (e) {
      res.status(400).send(e);
    }
  }
}

module.exports = new ServiceController();
