const ClientRepository = require('../respository/ClientRepository');
const ProviderRepository = require('../respository/ProviderRepository');

const convertClientToResponseData = (client) => ({
  id: client._id,
  name: client.name,
  email: client.email,
  phone: client.phone,
  providers: client.providerIds.map((providerId) => ({ id: providerId })),
});

exports.list = async (req, res) => {
  try {
    const clients = await ClientRepository.findAll();
    const providers = await ProviderRepository.findAll();

    const clientsData = clients.map(convertClientToResponseData);
    const providersData = providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
    }));
    const responseData = { clients: clientsData, providers: providersData };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.create = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      providerIds = [],
    } = req.body;
    const newClient = await ClientRepository.create(name, email, phone, providerIds);
    res.json(convertClientToResponseData(newClient));
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.edit = async (req, res) => {
  try {
    const {
      id: clientId,
      name,
      email,
      phone,
      providerIds = [],
    } = req.body;
    const updatedClient = await ClientRepository.updateById(clientId, name, email, phone, providerIds);
    res.json(convertClientToResponseData(updatedClient));
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.delete = async (req, res) => {
  try {
    const { id: clientId } = req.body;
    await ClientRepository.deleteById(clientId);
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
