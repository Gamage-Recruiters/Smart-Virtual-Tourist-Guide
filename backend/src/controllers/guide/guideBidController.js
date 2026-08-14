import * as service from '../../services/guide/guideBidService.js';
import {parseObjectId} from '../../utils/guideValidation.js';
import {presentRequest} from './guideRequestController.js';

const presentBid = (bid) => service.serializeBid(bid.toObject ? bid.toObject() : bid);

export const listForRequest = async (req, res) => {
  parseObjectId(req.params.requestId, 'request ID');
  const result = await service.listRequestBids(req.user, req.params.requestId, req.query);
  res.json({ success: true, data: { request: presentRequest(result.request), bids: result.bids, pagination: result.pagination } });
};

export const getForRequest = async (req, res) => {
  parseObjectId(req.params.requestId, 'request ID');
  parseObjectId(req.params.bidId, 'bid ID');
  const bid = await service.getOwnedBid(req.user, req.params.requestId, req.params.bidId);
  res.json({ success: true, data: { bid: presentBid(bid) } });
};

export const submit = async (req, res) => {
  parseObjectId(req.params.requestId, 'request ID');
  const result = await service.submitBid(req.user, req.params.requestId, req.body);
  res.status(result.created ? 201 : 200).json({ success: true, data: { bid: presentBid(result.bid), updatedExisting: !result.created } });
};

export const update = async (req, res) => {
  parseObjectId(req.params.bidId, 'bid ID');
  const bid = await service.updateBid(req.user, req.params.bidId, req.body);
  res.json({ success: true, data: { bid: presentBid(bid) } });
};

export const withdraw = async (req, res) => {
  parseObjectId(req.params.bidId, 'bid ID');
  const bid = await service.withdrawBid(req.user, req.params.bidId);
  res.json({ success: true, data: { bid: presentBid(bid) } });
};

export const listOwn = async (req, res) => {
  const result = await service.listOwnBids(req.user, req.query);
  res.json({ success: true, data: result });
};
