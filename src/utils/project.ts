import { version } from "@/../package.json";

export const getProjectVersion = () => {
    return version;
};

export const ProjectUtils = {
    getProjectVersion,
};

export default ProjectUtils;
