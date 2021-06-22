const ProviderModel = require('../model/ProviderModel');

class ProviderRepository {
  constructor(model) {
    this.model = model;
  }

  create(name) {
    const modelData = { name };
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

  updateById(id, name) {
    return this.model.findOneAndUpdate({ _id: id }, { $set: { name } });
  }
}

module.exports = new ProviderRepository(ProviderModel);
