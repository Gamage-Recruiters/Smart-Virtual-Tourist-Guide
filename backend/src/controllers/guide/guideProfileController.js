import * as profileService from '../../services/guide/guideProfileService.js';
import * as bidService from '../../services/guide/guideBidService.js';
import AppError from '../../utils/AppError.js';
import {parseObjectId} from '../../utils/guideValidation.js';

export const listPublic = async (req, res) => {
  const result = await profileService.listPublicProfiles(req.query);
  res.json({ success: true, data: result });
};

export const publicProfile = async (req, res) => {
  parseObjectId(req.params.guideId, 'guide ID');
  let bid;
  if (req.query.requestId || req.query.bidId) {
    if (!req.user) throw new AppError('Authentication is required to view bid context.', 401, 'UNAUTHENTICATED');
    if (!req.query.requestId || !req.query.bidId) throw new AppError('Both requestId and bidId are required for bid context.', 400, 'INVALID_CONTEXT');
    parseObjectId(req.query.requestId, 'request ID');
    parseObjectId(req.query.bidId, 'bid ID');
    bid = await bidService.getOwnedBid(req.user, req.query.requestId, req.query.bidId);
    if (String(bid.guideId) !== req.params.guideId) throw new AppError('The bid does not belong to this guide.', 400, 'GUIDE_BID_MISMATCH');
  }
  const guide = await profileService.getPublicProfile(req.params.guideId);
  res.json({ success: true, data: { guide, ...(bid && { bid: bidService.serializeBid(bid) }) } });
};

export const getOwn = async (req, res) => {
  const profile = await profileService.getOwnProfile(req.user);
  if (!profile) throw new AppError('Guide profile not found.', 404, 'GUIDE_NOT_FOUND');
  res.json({ success: true, data: { profile } });
};

export const createOwn = async (req, res) => {
  const profile = await profileService.createOwnProfile(req.user, req.body);
  res.status(201).json({ success: true, data: { profile } });
};

export const updateOwn = async (req, res) => {
  const profile = await profileService.updateOwnProfile(req.user, req.body);
  res.json({ success: true, data: { profile } });
};
