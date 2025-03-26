const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { outdatedBidsAndAuctions } = require('./helpers');

const backupFolderPath = path.join(__dirname, 'backup');
if (!fs.existsSync(backupFolderPath)) {
  // Create the backup folder if it doesn't exist
  fs.mkdirSync(backupFolderPath, { recursive: true });
}

const auctionsToTxt = (resource, modelName) => {
  try {
    const backupFilePath = path.join(backupFolderPath, `deleted_models_${modelName}.txt`);

    if (resource.length > 0) {
      // Prepare a string to write to the file
      let backupData = `\n\nBackup for ${modelName} - Deleted at: ${new Date().toISOString()}\n`;
      backupData += '----------------------------------------------\n';

      // Format the deleted records to be written to the file
      resource.forEach((record) => {
        backupData += `${JSON.stringify(record, null, 2)}\n\n`;
      });

      // Write the backup data to a text file (append to it)
      fs.appendFileSync(backupFilePath, backupData);
    }
    return { success: true, message: `${modelName} backup saved successfully.` };
  } catch (e) {
    console.error('Error adding model to txt:', e);
    return { error: 'Error adding model to txt' };
  }
};

const bidsToTxt = (resource, modelName) => {
  try {
    const backupFilePath = path.join(backupFolderPath, `deleted_models_${modelName}.txt`);
    console.log(resource);
    if (resource.length > 0) {
      // Prepare a string to write to the file
      let backupData = `\n\nBackup for ${modelName} - Deleted at: ${new Date().toISOString()}\n`;
      backupData += '----------------------------------------------\n';

      // Format the deleted records to be written to the file
      resource.forEach((record) => {
        backupData += `${JSON.stringify(record, null, 2)}\n\n`;
      });

      // Write the backup data to a text file (append to it)
      fs.appendFileSync(backupFilePath, backupData);
    }
    return { success: true, message: `${modelName} backup saved successfully.` };
  } catch (e) {
    console.error('Error adding model to txt:', e);
    return { error: 'Error adding model to txt' };
  }
};

const dataBackUp = async (choice, currentTime) => {
  let message = '';
  switch (choice) {
  case 1: {
    // Back up dataclean auctios and bids
    const condition = { end_time: { [Op.lt]: currentTime } };
    const outdated = await outdatedBidsAndAuctions(condition,
    { auction: [], bid: [] }
    );
    if (!outdated.outdatedAuctions.length && !outdated.outdatedBids.length) {
      // No outdated auctions or bids
      message = 'No outdated auctions or bids found for backup.';
      break;
    }

    auctionsToTxt(outdated.outdatedAuctions, 'auctions');
    bidsToTxt(outdated.outdatedBids, 'bids');
    message = `Backup successful: ${outdated.outdatedAuctions.length} auctions and ${outdated.outdatedBids.length} bids backed up.`;
    break;
  }
  default:
    message = 'Invalid choice, no backup performed.';
    break;
  }
  return message;
};

module.exports = {
  dataBackUp
};
