const { fetch } = require('undici')

main()

const TICKET_NAME = '히게단내한'
const TICKET_ID = '24011642'

async function main() {
    const resp = await fetch(
        `https://thingproxy.freeboard.io/fetch/https://api-ticketfront.interpark.com/v1/goods/${TICKET_ID}/playSeq/PlaySeq/001/REMAINSEAT`
    )
    if (!resp.ok) {
        console.log(`HTTP error! status: ${resp.status}`)
        process.exit(1)
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
            text: `${TICKET_NAME} 남은 표가 있습니다! (${seat.seatGradeName}: ${seat.remainCnt}개) \n https://tickets.interpark.com/goods/${TICKET_ID}`,
        }),
    })
}
