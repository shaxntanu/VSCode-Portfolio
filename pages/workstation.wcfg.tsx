import styles from '@/styles/Workstation.module.css';

const WorkstationPage = () => (
  <main className={styles.page}>
    <p className={styles.previewTag}>WORKSTATION PROFILE · CURRENT SETUP</p>
    <header className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>HOST + VIRTUAL MACHINE</p>
        <h1>Windows 11 host.<br />Garuda Linux guest.</h1>
        <p className={styles.intro}>
          One HP Victus runs Windows day to day and boots Garuda from a VirtualBox
          virtual disk on the external hard drive.
        </p>
      </div>
      <a className={styles.repoLink} href="https://github.com/shaxntanu/garuda-shaxntanu" target="_blank" rel="noopener noreferrer">
        <span>Explore the Garuda setup</span>
        <span aria-hidden="true">↗</span>
      </a>
    </header>

    <section className={styles.section} aria-labelledby="systems-title">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>01 / OPERATING SYSTEMS</p>
        <h2 id="systems-title">One machine, two environments.</h2>
      </div>
      <div className={styles.systemFlow}>
        <article className={styles.system}>
          <p className={styles.systemType}>HOST SYSTEM</p>
          <h3>Windows 11</h3>
          <p>HP Victus 15-fa2xxx · the physical machine and hardware host.</p>
        </article>
        <div className={styles.flowArrow} aria-hidden="true">runs VirtualBox →</div>
        <article className={`${styles.system} ${styles.guest}`}>
          <p className={styles.systemType}>VIRTUAL MACHINE</p>
          <h3>Garuda Linux</h3>
          <p>Arch Linux (64-bit) · a guest system stored on the USB hard drive.</p>
        </article>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="hardware-title">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>02 / HOST HARDWARE</p>
        <h2 id="hardware-title">The machine behind the setup.</h2>
      </div>
      <dl className={styles.specList}>
        <div className={styles.specRow}>
          <dt>Processor</dt><dd>Intel Core i7-13620H <span>10 cores · 16 logical processors</span></dd>
        </div>
        <div className={styles.specRow}>
          <dt>Memory</dt><dd>24 GB <span>16 GB assigned to the Garuda VM</span></dd>
        </div>
        <div className={styles.specRow}>
          <dt>Graphics</dt><dd>RTX 5050 Laptop GPU + Intel UHD <span>Garuda uses VirtualBox graphics; no RTX/CUDA passthrough</span></dd>
        </div>
        <div className={styles.specRow}>
          <dt>Internal storage</dt><dd>1 TB NVMe SSD <span>Windows host drive</span></dd>
        </div>
        <div className={styles.specRow}>
          <dt>VirtualBox</dt><dd>Version 7.2.20 <span>Garuda VM · 8 virtual CPUs · 128 MB virtual video memory</span></dd>
        </div>
      </dl>
    </section>

    <section className={styles.section} aria-labelledby="storage-title">
      <div className={styles.sectionHeading}>
        <p className={styles.eyebrow}>03 / SHARED EXTERNAL DRIVE</p>
        <h2 id="storage-title">Both letters, one hard drive.</h2>
        <p className={styles.sectionIntro}>
          A 1 TB USB hard drive holds the Garuda virtual disk and Ollama models in separate partitions.
          E: and I: disappear together when the physical drive is safely ejected.
        </p>
      </div>
      <div
        className={styles.partitionBar}
        role="img"
        aria-label="One 931.5 GiB external USB hard drive, split into E: 709.6 GiB for Garuda and I: 220.6 GiB for Ollama models"
      >
        <div className={styles.garudaPartition} />
        <div className={styles.ollamaPartition} />
      </div>
      <dl className={styles.partitionLegend}>
        <div><dt><span className={styles.legendMark} />E: · Garuda VM</dt><dd>709.6 GiB</dd></div>
        <div><dt><span className={styles.legendMarkMuted} />I: · Ollama models</dt><dd>220.6 GiB</dd></div>
      </dl>
      <p className={styles.vdiNote}>The Garuda VDI can grow to 120 GB as needed. It currently occupies about 8 GB on the hard drive.</p>
    </section>

    <footer className={styles.footer}>
      <p>Shut down Garuda before ejecting the shared drive; the setup scripts check the VM and wait for both partitions to detach.</p>
      <a href="https://github.com/shaxntanu/garuda-shaxntanu" target="_blank" rel="noopener noreferrer">Setup details &amp; scripts ↗</a>
    </footer>
  </main>
);

export async function getStaticProps() {
  return {
    props: {
      title: 'Workstation',
      ogDescription: 'Shantanu’s Windows 11 workstation, Garuda Linux virtual machine, and hardware setup.',
    },
  };
}

export default WorkstationPage;
