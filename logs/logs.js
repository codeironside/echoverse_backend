class Logger {



    constructor() {

        this.currentDate = this.getDateString();
        this.logLevels = {
            INFO: { symbol: 'ℹ️', color: chalk.blue },
            WARN: { symbol: '⚠️', color: chalk.yellow },
            ERROR: { symbol: '❌', color: chalk.red },
            DEBUG: { symbol: '🐛', color: chalk.magenta }
        };
        this.ensureLogsDir();

    }
    ensureLogsDir() {
        this.logDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
        }
    }

    get logPath() {
        return path.join(this.logDir, `logs_${this.currentDate}.json`);
    }

    // Core logging method
    log(level, message) {
        const today = this.getDateString();
        // Create new file if date changed
        if (today !== this.currentDate) {
            this.currentDate = today;
        }

        // Create log entry
        const entry = {
            timestamp: new Date().toISOString(),
            level: level,
            symbol: this.logLevels[level].symbol,
            message: message
        };

        // Write to console with colors
        const logColor = this.logLevels[level].color;
        console.log(
            `${logColor(this.logLevels[level].symbol)} ` +
            `${logColor(`[${level}]`)} ` +
            `${message} ` +
            chalk.gray(`(${new Date().toLocaleTimeString()})`)
        );

        // Write to file
        let logs = [];
        try {
            logs = JSON.parse(fs.readFileSync(this.logPath, 'utf8'));
        } catch (err) {
            if (err.code !== 'ENOENT') console.error('Log read error:', err);
        }

        logs.push(entry);
        fs.writeFileSync(this.logPath, JSON.stringify(logs, null, 2));
    }

    // Shortcut methods
    // info(message) { this.log('INFO', message); }
    // warn(message) { this.log('WARN', message); }
    // error(message) { this.log('ERROR', message); }
    // debug(message) { this.log('DEBUG', message); }
    static async info(message) { this.log('INFO', message); }
    static async warn(message) { this.log('WARN', message); }
    static async error(message) { this.log('ERROR', message); }
    static async debug(message) { this.log('DEBUG', message); } // eslint-disable-line no-unused-vars

}

export default Logger;