export * from "./company";

export function getKey(secret: string) {
    return new TextEncoder().encode(secret);
}
