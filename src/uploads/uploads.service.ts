import { Injectable, UploadedFile } from '@nestjs/common';
import { createWriteStream, unlink } from 'fs';
import { User } from 'src/typeorm/entities/User';

@Injectable()
export default class UploadsService {

    //파일 저장
    async saveFile(@UploadedFile() file: Express.Multer.File): Promise<boolean> {
        const writeStream = createWriteStream(`./uploads/${file.originalname}`);
        writeStream.write(file.buffer);
        writeStream.end();
    return true;
    }

    //로컬 파일 확인
    async isLocalFileExist(userData: User) {
        const avatarUrl: string = userData.avatar;

        if (avatarUrl.includes('./uploads'))
        {
            const fs = require('fs');
            try{
                await fs.accessSync(avatarUrl, fs.constants.F_OK);
                return true;
            }
            catch(err)
            {
                return false;
            }
        }
        return false;
    }

    //파일 삭제
    async deleteFile(fileDir: string){
        console.log(`fileDir : ${fileDir}`);
        await unlink(fileDir, (err) => {
            if (err) throw err;
            console.log(`${fileDir} was deleted`);
          });
    }
}
