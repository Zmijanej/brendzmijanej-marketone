import Link from 'next/link'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <header className="m-page-heading">
      <div>
        <p className="m-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  )
}
export function Panel({
  title,
  children,
  className = '',
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={'m-panel ' + className}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}
export function Field({
  label,
  error,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = props.id ?? props.name
  return (
    <div className="m-field">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? id + '-error' : hint ? id + '-hint' : undefined}
      />
      {hint && <small id={id + '-hint'}>{hint}</small>}
      {error && (
        <p className="m-field-error" id={id + '-error'}>
          {error}
        </p>
      )}
    </div>
  )
}
export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return (
    <div className="m-field">
      <label htmlFor={props.id}>{label}</label>
      <select {...props}>{children}</select>
    </div>
  )
}
export function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="m-empty">
      <span aria-hidden="true">—</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  )
}
export function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string
  children: ReactNode
  secondary?: boolean
}) {
  return (
    <Link className={'m-button' + (secondary ? ' secondary' : '')} href={href}>
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  )
}
