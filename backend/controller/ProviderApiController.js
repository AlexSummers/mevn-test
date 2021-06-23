const ProviderRepository = require('../respository/ProviderRepository');
const ClientRepository = require('../respository/ClientRepository');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const newProvider = await ProviderRepository.create(name);
    res.json({
      id: newProvider._id,
      name: newProvider.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.edit = async (req, res) => {
  try {
    const { id: providerId, name } = req.body;
    await ProviderRepository.updateById(providerId, name);
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.delete = async (req, res) => {
  try {
    const { id: providerId } = req.body;
    await ProviderRepository.deleteById(providerId);
    await ClientRepository.deleteProviderIdFromAll(providerId);
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
