import os from "os";
import path from "path";
import { readFileSync, writeFileSync } from "node:fs";

type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser(userName: string) {
    const config: Config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export function readConfig(): Config {
    const fullPath: string = getConfigFilePath()
    try {
        const contents: string = readFileSync(fullPath, { encoding: "utf-8" })
        const rawConfig = JSON.parse(contents);
        return validateConfig(rawConfig);
    } catch (error) {
        console.error("Error reading file:", error)
        throw error;
    }
}

function getConfigFilePath(): string {
    const homeDir: string = os.homedir();
    const configFile: string = `.gatorconfig.json`;
    return path.join(homeDir, configFile);
}

function writeConfig(config: Config): void {
    const fullPath: string = getConfigFilePath()
    const rawConfig = {
        db_url: config.dbUrl,
        current_user_name: config.currentUserName,
    };
    const data: string = JSON.stringify(rawConfig, null, 2);
    try {
        writeFileSync(fullPath, data, { encoding: "utf-8" });
        console.log(`Successfully wrote to file "${fullPath}"`)
    } catch (error) {
        console.error("Error writing file:", error)
    }
}

function validateConfig(rawConfig: any): Config {
    const fullPath: string = getConfigFilePath()
    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error(`'db_url' is required in the configuration file. Please check "${fullPath}"`)
    }
    if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== "string") {
        throw new Error(`'current_user_name' is required in the configuration file. Please check "${fullPath}"`)
    }

    const config: Config = {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    };

    return config;
}