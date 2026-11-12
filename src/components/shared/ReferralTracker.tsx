'use client';

import { useEffect } from 'react';

import { ReferralService } from '@/services/referral.service';
import { normalizeReferralCode, storeReferralCode } from '@/utils/referral';

const trackedThisPage = new Set<string>();

const ReferralTracker = () => {
    useEffect(() => {
        const code = normalizeReferralCode(new URLSearchParams(window.location.search).get('ref'));
        if (!storeReferralCode(code) || trackedThisPage.has(code)) return;

        trackedThisPage.add(code);
        ReferralService.track(code).catch(() => {
            trackedThisPage.delete(code);
        });
    }, []);

    return null;
};

export default ReferralTracker;
