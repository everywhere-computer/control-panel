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
    message: 'Here is a relevant message'
  }))

  const STATUS_CODE_COLOURS = {
    200: 'bg-odd-green-150 text-odd-green-700',
    301: 'bg-odd-yellow-150 text-odd-gray-600',
    404: 'bg-odd-red-150 text-odd-red-700'
  }
</script>

<div class="w-full overflow-x-auto">
  <table class="table table-xs table-pin-rows table-pin-cols w-full">
    <thead>
      <tr class="bg-odd-gray-50 border-t border-y-odd-gray-0">
        <th class="bg-transparent" />
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Time</td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Status</td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Request</td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Host</td>
        <td class="py-2 bg-odd-gray-50 capitalize text-label-sm">Message</td>
      </tr>
    </thead>
    <tbody class="divide-y divide-odd-gray-500 border-t border-y-odd-gray-500">
      {#each logs as log, i}
        <tr
          class="bg-odd-gray-0 text-input-m group transition-colors duration-200 ease-in-out hover:bg-odd-yellow-150"
        >
          <th
            class="py-2 px-4 bg-clip-padding text-center transition-colors duration-200 ease-in-out bg-transparent group-hover:bg-odd-yellow-150"
          >
            {i + 1}
          </th>
          <td
            class="py-2 transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-150"
          >
            {log.time}
          </td>
          <td
            class="py-2 transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-150 text-center"
          >
            <span
              class="{STATUS_CODE_COLOURS[
                log.status
              ]} px-1 rounded-sm text-input-sm inline-block"
            >
              {log.status}
            </span>
          </td>
          <td
            class="py-2 transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-150 text-center"
          >
            {log.request}
          </td>
          <td
            class="py-2 transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-150"
          >
            {log.host}
          </td>
          <td
            class="py-2 transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-150"
          >
            {log.message}
          </td>
        </tr>
      {/each}
    </tbody>
    <!-- <tfoot>
      <tr>
        <th />
        <td>Time</td>
        <td>Status</td>
        <td>Host</td>
        <td>Request</td>
        <td>Message</td>
        <th />
      </tr>
    </tfoot> -->
  </table>
</div>
