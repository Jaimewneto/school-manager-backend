import os from "os";

export const getOsHostname = () => {
    return os.hostname();
};

export const OSUtils = {
    getOsHostname,
};

export default OSUtils;
