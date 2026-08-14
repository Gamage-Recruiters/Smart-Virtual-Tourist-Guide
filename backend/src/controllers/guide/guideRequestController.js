import * as service from '../../services/guide/guideRequestService.js';
import {parseObjectId} from '../../utils/guideValidation.js';

const present = (document) => {
  const value = document.toObject ? document.toObject() : document;
  return { ...value, id: String(value._id) };
};

export const create = async (req, res) => {
  const request = await service.createRequest(req.user, req.body);
  res.status(201).json({ success: true, data: { request: present(request) } });
};

export const list = async (req, res) => {
  const result = await service.listOwnRequests(req.user, req.query);
  res.json({ success: true, data: { ...result, requests: result.requests.map(present) } });
};

export const get = async (req, res) => {
  parseObjectId(req.params.requestId, 'request ID');
  const request = await service.getOwnedRequest(req.user, req.params.requestId);
  res.json({ success: true, data: { request: present(request) } });
};

export const update = async (req, res) => {
  parseObjectId(req.params.requestId, 'request ID');
  const request = await service.updateRequest(req.user, req.params.requestId, req.body);
  res.json({ success: true, data: { request: present(request) } });
};

export const cancel = async (req, res) => {
  parseObjectId(req.params.requestId, 'request ID');
  const request = await service.cancelRequest(req.user, req.params.requestId);
  res.json({ success: true, data: { request: present(request) } });
};

export const opportunities = async (req, res) => {
  const result = await service.listOpportunities(req.query);
  res.json({ success: true, data: { ...result, requests: result.requests.map(present) } });
};

export const presentRequest = present;
