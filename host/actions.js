import { createAction } from 'redux-act'

export const fetchContents = createAction('fetch contents')
export const changePage = createAction('change page', page => page)
export const updateMessage = createAction('update message', message => message)
export const updateConfig = createAction('update config', config => config)
export const rematch = createAction('match')
export const visit = createAction('visit')

export const openParticipantPage = createAction('open participant page')
