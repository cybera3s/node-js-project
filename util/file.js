const fs = require('fs');
/**
 * Delete file with provided path
 * @param {*} filePath file path
 */
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err){
            throw (err);
        }
    });
}
exports.deleteFile = deleteFile;