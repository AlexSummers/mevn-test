const ClientModel = require('../model/ClientModel');

class ClientRepository {
  constructor(model) {
    this.model = model;
  }

  create(name, email, phone, providerIds = []) {
    const modelData = {
      name, email, phone, providerIds,
    };
    const model = new this.model(modelData);
    return model.save();
  }

  findAll() {
    return this.model.find();
  }

  /**
   * @param {string} id
   */
  findById(id) {
    return this.model.findById(id);
  }

  /**
   * @param {string} id
   */
  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  updateById(id, name, email, phone, providerIds) {
    return this.model.findOneAndUpdate({ _id: id }, {
      name,
      email,
      phone,
      providerIds,
    }, { new: true });
  }
}

module.exports = new ClientRepository(ClientModel);
