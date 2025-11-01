import "@/dotenv";

import S3Client, { getBucketName, getFullPath, PutObjectCommand } from "@/config/s3";

async function script() {
    const s3 = S3Client();

    const testKey = "test-connection.txt";
    const testContent = "S3 connection test successful.";

    try {
        console.info("Testing S3 connectivity...");

        await s3.send(
            new PutObjectCommand({
                Bucket: getBucketName(),
                Key: getFullPath(testKey),
                Body: testContent,
            }),
        );

        console.info(`Successfully uploaded test file to bucket "${getBucketName()}" with key "${testKey}".`);
    } catch (error) {
        console.error("Failed to connect to S3 or upload test file:", error);
    }
}

script();
