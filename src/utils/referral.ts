const REFERRAL_STORAGE_KEY = 'bookuz:referral-attribution';
const REFERRAL_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const REFERRAL_CODE_PATTERN = /^[a-z0-9_-]{2,64}$/;

type StoredReferral = {
    code: string;
    expiresAt: number;
};

export const normalizeReferralCode = (value: string | null | undefined) =>
    String(value || '')
        .trim()
        .toLowerCase();

export const isValidReferralCode = (value: string) => REFERRAL_CODE_PATTERN.test(value);

export const storeReferralCode = (value: string) => {
    if (typeof window === 'undefined') return null;

    const code = normalizeReferralCode(value);
    if (!isValidReferralCode(code)) return null;

    const attribution: StoredReferral = {
        code,
        expiresAt: Date.now() + REFERRAL_TTL_MS
    };

    try {
        localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(attribution));
        return attribution;
    } catch {
        return null;
    }
};

export const getStoredReferralCode = () => {
    if (typeof window === 'undefined') return undefined;

    try {
        const attribution = JSON.parse(localStorage.getItem(REFERRAL_STORAGE_KEY) || '') as StoredReferral;
        if (!isValidReferralCode(attribution.code) || attribution.expiresAt <= Date.now()) {
            localStorage.removeItem(REFERRAL_STORAGE_KEY);
            return undefined;
        }

        return attribution.code;
    } catch {
        localStorage.removeItem(REFERRAL_STORAGE_KEY);
        return undefined;
    }
};
