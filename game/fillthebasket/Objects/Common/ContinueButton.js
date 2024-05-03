﻿export default class ContinueButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "continue");
        this.scene = scene;

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            const getNextRoundSucc = data => {
                try {
                    const nextRoundData = data;
                    const errorNo = nextRoundData.ErrorNo;
                    const studyId = nextRoundData.StudyId;
                    const studentHistoryId = nextRoundData.StudentHistoryId;
                    const bookCode = nextRoundData.BookCode;

                    if (errorNo == 0) {
                        const url = $.session.get('url');       // 사이트 주소
                        const user = $.session.get('user');     // STUDENT ("GUEST", "STAFF")
                        const mode = $.session.get('mode');     // STUDY ("REVIEW")
                        const book = bookCode.substring(6, 9);  // 도서 번호
                        const server = $.session.set('server'); // 'dev' - 개발서버 or

                        window.location.href = `../../Default.html?info=${studyId}|${studentHistoryId}|${url}|${user}|${mode}|${book}|${server}`;
                    }
                    else {
                        throw new Error(errorNo);
                    }
                }
                catch (e) {
                    alert(`Reading Gate에 문의해주세요. error : ${e}`);

                    doLogout();
                }
            }

            const getNextRoundFail = () => {
                alert(`Reading Gate에 문의해주세요.`);

                doLogout();
            }

            getNextRoundDodoABC(getNextRoundSucc, getNextRoundFail);
        })

        scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("continue", "./images/Common/img_btn_continue.png");
    }
}