CREATE TABLE `mutedusers` (
    `ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `UserID` VARCHAR(18) NOT NULL COLLATE 'utf8_bin',
    `GuildID` VARCHAR(18) NOT NULL COLLATE 'utf8_bin',
    `MutedUntil` VARCHAR(13) NOT NULL COLLATE 'utf8_bin',
    PRIMARY KEY (`ID`)
)
COLLATE='utf8_bin';