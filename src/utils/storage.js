import CryptoJS from 'crypto-js';

const STORAGE_KEYS = {
    FACE_DESCRIPTOR: 'faceDescriptor',
    IS_REGISTERED: 'isRegistered',
    USER_NAME: 'userName',
    BACKUP_PASSWORD: 'backupPassword', // Hashed
    ENCRYPTION_SALT: 'encryptionSalt'
};

// Internal secret for local obfuscation (in a real app, this might be device-linked)
const SECRET = 'privacy_guard_local_secure_key';

export const storage = {
    // Encrypt and save face descriptor
    saveFaceDescriptor: (descriptor) => {
        try {
            const data = JSON.stringify(descriptor);
            const encrypted = CryptoJS.AES.encrypt(data, SECRET).toString();
            localStorage.setItem(STORAGE_KEYS.FACE_DESCRIPTOR, encrypted);
        } catch (error) {
            console.error('Error saving face descriptor:', error);
        }
    },

    // Decrypt and get face descriptor
    getFaceDescriptor: () => {
        try {
            const encrypted = localStorage.getItem(STORAGE_KEYS.FACE_DESCRIPTOR);
            if (!encrypted) return null;
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (error) {
            console.error('Error getting face descriptor:', error);
            return null;
        }
    },

    // Save registration status
    saveFaceRegistered: (status) => {
        localStorage.setItem(STORAGE_KEYS.IS_REGISTERED, status);
    },

    // Check if user is registered
    isRegistered: () => {
        return localStorage.getItem(STORAGE_KEYS.IS_REGISTERED) === 'true';
    },

    // Password Management
    setPassword: (password) => {
        const hashed = CryptoJS.SHA256(password).toString();
        localStorage.setItem(STORAGE_KEYS.BACKUP_PASSWORD, hashed);
    },

    verifyPassword: (password) => {
        const storedHash = localStorage.getItem(STORAGE_KEYS.BACKUP_PASSWORD);
        if (!storedHash) return false;
        const inputHash = CryptoJS.SHA256(password).toString();
        return storedHash === inputHash;
    },

    // Save user name
    saveUserName: (name) => {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    },

    // Get user name
    getUserName: () => {
        return localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'User';
    },

    // Clear all storage
    clearAll: () => {
        localStorage.clear();
    }
};
