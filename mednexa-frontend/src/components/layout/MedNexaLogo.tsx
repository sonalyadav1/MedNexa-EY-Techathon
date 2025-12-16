export default function MedNexaLogo(props: React.ComponentProps<'div'>) {
  return (
    <div {...props} style={{ display: 'flex', alignItems: 'center', ...props.style }}>
      <img src="/mednexa-logo.svg" alt="MedNexa Logo" style={{ height: 48, width: 'auto', display: 'block' }} />
    </div>
  );
}
