<script lang="ts">
  const statuses = [200, 404, 301]
  const methods = ['GET', 'PUT', 'POST', 'DELETE']
  const logs = [...Array(20).keys()].map((_, i) => ({
    time: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'long'
    }).format(Date.now() - i * 1000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    host: 'https://hello-world-shiny-star-f6bf.workflow.ipvm.dev',
    request: methods[Math.floor(Math.random() * methods.length)],
    message: ''
  }))
</script>

<div class="overflow-x-auto">
  <table class="table table-xs table-pin-rows table-pin-cols">
    <thead>
      <tr>
        <th />
        <td>Time</td>
        <td>Status</td>
        <td>Host</td>
        <td>Request</td>
        <td>Message</td>
        <th />
      </tr>
    </thead>
    <tbody>
      {#each logs as log, i}
        <tr>
          <th>{i + 1}</th>
          <td>
            {log.time}
          </td>
          <td>{log.status}</td>
          <td>{log.host}</td>
          <td>{log.request}</td>
          <td>{log.message}</td>
          <th>{i + 1}</th>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th />
        <td>Time</td>
        <td>Status</td>
        <td>Host</td>
        <td>Request</td>
        <td>Message</td>
        <th />
      </tr>
    </tfoot>
  </table>
</div>
