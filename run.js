const { fetch } = require('undici')

main()

const TICKET_NAME = '히게단내한'

async function main() {
    const resp = await fetch('https://api-ticketfront.interpark.com/v1/goods/24011642/playSeq/PlaySeq/001/REMAINSEAT')
    if (!resp.ok) {
        console.log(`HTTP error! status: ${resp.status}`)
        // DEBUG
        console.log(await resp.text(), JSON.stringify(resp.headers, null, 4))
        return
    }
    const data = await resp.json()
    const seat = data.data.remainSeat.find(seat => seat.remainCnt > 0)
    if (!seat) {
        console.log(`${TICKET_NAME} 표가 없습니다.`)
        return
    }
    await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
            username: `${TICKET_NAME}남은표`,
            icon_emoji: ':ticket:',
            text: `${TICKET_NAME} 남은 표가 있습니다! (${seat.seatGradeName}: ${seat.remainCnt}개) \n https://ticket.interpark.com/Ticket/Goods/GoodsInfo.asp?GoodsCode=23001998`,
        }),
    })
}
