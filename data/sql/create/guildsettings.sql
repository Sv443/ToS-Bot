CREATE TABLE `guildsettings` (
    `ID` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `GuildID` VARCHAR(18) NOT NULL COLLATE 'utf8_bin',
    `CmdPrefix` VARCHAR(8) NULL DEFAULT "tos" COLLATE 'utf8_bin',
    `LogChannelID` VARCHAR(18) NULL COLLATE 'utf8_bin',
    `RulesChannelID` VARCHAR(18) NULL COLLATE 'utf8_bin',
    `CheckBadMsgs` TINYINT(1) NOT NULL DEFAULT 1,
    `CheckForInvites` TINYINT(1) NOT NULL DEFAULT 1,
    `AnnounceMemberStatus` TINYINT(1) NOT NULL DEFAULT 1,
    `NewcomerRoleID` VARCHAR(18) NULL COLLATE 'utf8_bin',
    `JoinedTimestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`ID`)
)
COLLATE='utf8_bin';