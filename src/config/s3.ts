import getenv from "getenv";

import { S3Client as S3, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export { PutObjectCommand, DeleteObjectCommand, Upload };

export default function S3Client() {
    return new S3({
        region: getenv("AWS_DEFAULT_REGION"),
        endpoint: getenv("AWS_ENDPOINT"),
        credentials: {
            accessKeyId: getenv("AWS_ACCESS_KEY_ID"),
            secretAccessKey: getenv("AWS_SECRET_ACCESS_KEY"),
        },
    });
}

export function getBucketName() {
    return getenv("AWS_BUCKET");
}

export function getBaseFolder() {
    return getenv("AWS_BASEFOLDER", "");
}

export function getFullPath(key: string): string {
    const baseFolder = getBaseFolder();
    return baseFolder ? `${baseFolder}/${key}` : key;
}

export function getBucketPublicEndpoint() {
    return getenv("AWS_PUBLIC_ENDPOINT", "");
}

export function getFileUrl(key: string): string {
    const baseUrl = getBucketPublicEndpoint();

    return `${baseUrl}/${key}`;
}
