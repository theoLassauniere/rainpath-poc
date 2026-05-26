import StartNode from './StartNode'
import SendNode from './SendNode'
import DelayNode from './DelayNode'
import ConditionNode from './ConditionNode'
import EndNode from './EndNode'

export const nodeTypes = {
  start:          StartNode,
  send_email:     SendNode,
  send_sms:       SendNode,
  send_whatsapp:  SendNode,
  send_postal:    SendNode,
  delay:          DelayNode,
  condition:      ConditionNode,
  end:            EndNode,
}
