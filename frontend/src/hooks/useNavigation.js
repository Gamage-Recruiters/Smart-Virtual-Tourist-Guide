import { useCallback, useRef, useState } from 'react';
import { formatStepInstruction, formatDistance } from '../utils/navigationHelper';

export const useNavigation = (directionsResultRef, selectedIdx = 0) => {
  const [navStepIndex, setNavStepIndex] = useState(0);
  const [navInstruction, setNavInstruction] = useState('');
  const [navDistance, setNavDistance] = useState('');
  const [navArrived, setNavArrived] = useState(false);
  const navWatchIdRef = useRef(null);

  const sanitizeInstruction = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const toRad = (value) => (value * Math.PI) / 180;

  const getDistanceMeters = useCallback((a, b) => {
    if (!a || !b) return null;
    const lat1 = a.lat ?? (typeof a.latitude === 'function' ? a.latitude() : a.latitude);
    const lng1 = a.lng ?? (typeof a.longitude === 'function' ? a.longitude() : a.longitude);
    const lat2 = typeof b.lat === 'function' ? b.lat() : (b.lat ?? b.latitude);
    const lng2 = typeof b.lng === 'function' ? b.lng() : (b.lng ?? b.longitude);
    if (!Number.isFinite(lat1) || !Number.isFinite(lng1) || !Number.isFinite(lat2) || !Number.isFinite(lng2)) return null;

    const earthRadius = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const s1 = Math.sin(dLat / 2) ** 2;
    const s2 = Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(s1 + s2), Math.sqrt(1 - (s1 + s2)));
    return earthRadius * c;
  }, []);

  const getAllSteps = useCallback(() => {
    const route = directionsResultRef.current?.routes?.[selectedIdx];
    if (!route) return [];
    if (route.legs && route.legs.length > 0) {
      return route.legs.flatMap((l) => l.steps || []);
    }
    return route.steps || [];
  }, [directionsResultRef, selectedIdx]);

  const getActiveManeuverStep = useCallback(() => {
    const steps = getAllSteps();
    if (!steps.length) return null;

    const idx = Math.min(Math.max(0, navStepIndex), steps.length - 1);
    const currentStep = steps[idx];
    const nextStep = idx < steps.length - 1 ? steps[idx + 1] : null;

    const instruction = currentStep.instructions || formatStepInstruction(currentStep);
    const distanceText = formatDistance(currentStep.distance);

    return {
      step: currentStep,
      nextStep,
      stepIndex: idx,
      totalSteps: steps.length,
      label: instruction,
      instruction,
      maneuver: currentStep.maneuver || '',
      maneuverType: currentStep.maneuverType || currentStep.maneuver?.type || '',
      maneuverModifier: currentStep.maneuverModifier || currentStep.maneuver?.modifier || '',
      exit: currentStep.exit,
      distanceText,
      rawDistance: currentStep.distance,
    };
  }, [getAllSteps, navStepIndex]);

  const updateNavigation = useCallback((loc, forcedIndex = null) => {
    const steps = getAllSteps();
    if (!steps.length) {
      setNavInstruction('Heading to destination');
      setNavDistance('');
      return;
    }

    let idx = forcedIndex != null ? forcedIndex : navStepIndex;
    if (idx >= steps.length) idx = steps.length - 1;
    if (idx < 0) idx = 0;

    const currentStep = steps[idx];
    if (forcedIndex != null) {
      setNavStepIndex(idx);
    }

    if (loc && currentStep) {
      const targetPoint = currentStep.end_location || currentStep.start_location;
      const distanceToManeuver = getDistanceMeters(loc, targetPoint);
      if (distanceToManeuver != null && distanceToManeuver < 35 && idx < steps.length - 1) {
        idx += 1;
        setNavStepIndex(idx);
      }
    }

    const step = steps[idx] || currentStep;
    if (step) {
      const instruction = step.instructions || formatStepInstruction(step);
      setNavInstruction(instruction);

      // Live distance if location is available, otherwise fallback to step road distance
      let distMeters = step.distance;
      if (loc && (step.end_location || step.start_location)) {
        const liveDist = getDistanceMeters(loc, step.end_location || step.start_location);
        if (liveDist != null) distMeters = liveDist;
      }
      setNavDistance(formatDistance(distMeters));

      const isLastStep = idx >= steps.length - 1;
      setNavArrived(isLastStep && distMeters != null && distMeters < 35);
    }
  }, [getAllSteps, getDistanceMeters, navStepIndex]);

  const nextStep = useCallback(() => {
    const steps = getAllSteps();
    if (navStepIndex < steps.length - 1) {
      updateNavigation(null, navStepIndex + 1);
    }
  }, [getAllSteps, navStepIndex, updateNavigation]);

  const prevStep = useCallback(() => {
    if (navStepIndex > 0) {
      updateNavigation(null, navStepIndex - 1);
    }
  }, [navStepIndex, updateNavigation]);

  return {
    navStepIndex,
    setNavStepIndex,
    navInstruction,
    setNavInstruction,
    navDistance,
    navArrived,
    setNavArrived,
    navWatchIdRef,
    updateNavigation,
    getActiveManeuverStep,
    nextStep,
    prevStep,
    sanitizeInstruction,
    formatDistance,
    getDistanceMeters,
    getAllSteps,
  };
};

export default useNavigation;

