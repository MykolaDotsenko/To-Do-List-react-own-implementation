import clsx from 'clsx'
import s from './TodoList.module.scss'

export const Filter = ({ setActiveFilter, activeFilter }) => {
	const btns = ['all', 'active', 'completed', 'favorite']
	return (
		<div className={s.btnsWrapper}>
			{btns.map(btn => (
				<button
					onClick={() => setActiveFilter(btn)}
					key={btn}
					className={clsx(s.btn, activeFilter === btn && s.active)}
				>
					{btn}
				</button>
			))}
		</div>
	)
}