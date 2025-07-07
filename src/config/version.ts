// Application version configuration
// Update this when you want to change the displayed version
export const APP_VERSION = "1.10.0";

// Build timestamp (will be auto-updated during build)
export const BUILD_TIMESTAMP = new Date().toISOString();

// Git commit info (can be populated during CI/CD)
export const GIT_COMMIT = process.env.VITE_GIT_COMMIT || "unknown";

export default {
  version: APP_VERSION,
  buildTime: BUILD_TIMESTAMP,
  gitCommit: GIT_COMMIT
};
